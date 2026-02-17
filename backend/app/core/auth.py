import time
import requests
from  jose import jwk, jwt
from jose.utils import base64url_decode
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.core.config import settings

security = HTTPBearer()

class CognitoAuth:
    def __init__(self):
        self.region = settings.AWS_REGION
        self.user_pool_id = settings.COGNITO_USER_POOL_ID
        self.app_client_id = settings.COGNITO_CLIENT_ID
        self.keys_url = f'https://cognito-idp.{self.region}.amazonaws.com/{self.user_pool_id}/.well-known/jwks.json'
        self.keys = []
        self._last_keys_fetch = 0

    def _get_keys(self):
        # Refresh keys every hour could be a strategy, or just on failure.
        # Simple caching for now.
        if not self.keys or (time.time() - self._last_keys_fetch > 3600):
            try:
                response = requests.get(self.keys_url)
                response.raise_for_status()
                self.keys = response.json()['keys']
                self._last_keys_fetch = time.time()
            except Exception as e:
                print(f"Error fetching Cognito JWKS: {e}")
                # Don't clear keys if fetch fails but we have old ones, unless persistent issues
        return self.keys

    def verify_token(self, token: str):
        keys = self._get_keys()
        headers = jwt.get_unverified_header(token)
        kid = headers['kid']
        
        key_index = -1
        for i in range(len(keys)):
            if kid == keys[i]['kid']:
                key_index = i
                break
        
        if key_index == -1:
            raise HTTPException(status_code=401, detail="Public key not found in JWKS")
            
        public_key = jwk.construct(keys[key_index])
        
        message, encoded_signature = str(token).rsplit('.', 1)
        decoded_signature = base64url_decode(encoded_signature.encode('utf-8'))
        
        if not public_key.verify(message.encode("utf8"), decoded_signature):
             raise HTTPException(status_code=401, detail="Signature verification failed")
             
        claims = jwt.get_unverified_claims(token)
        
        if time.time() > claims['exp']:
             raise HTTPException(status_code=401, detail="Token expired")
             
        if claims['aud'] != self.app_client_id:
             # Sometimes aud is in access token, sometimes client_id is in 'client_id' claim
             if claims.get('client_id') != self.app_client_id:
                raise HTTPException(status_code=401, detail="Token was not issued for this client")
                
        return claims

cognito_auth = CognitoAuth()

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        claims = cognito_auth.verify_token(token)
        return claims
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid authentication credentials: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )
