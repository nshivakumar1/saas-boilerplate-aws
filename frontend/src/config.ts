export const config = {
    cognito: {
        userPoolId: 'us-east-1_LDhZ8Aefj',
        userPoolClientId: '7kl0gu16bl95mdkqug4lthupu0',
    },
    api: {
        baseUrl: import.meta.env.VITE_API_URL || '/api/v1',
    }
};
