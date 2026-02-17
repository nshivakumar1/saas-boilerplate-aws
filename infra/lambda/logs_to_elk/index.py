import base64
import gzip
import json
import os
import urllib.request

ELASTICSEARCH_ENDPOINT = os.environ['ELASTICSEARCH_ENDPOINT']

def lambda_handler(event, context):
    cw_data = event['awslogs']['data']
    compressed_payload = base64.b64decode(cw_data)
    uncompressed_payload = gzip.decompress(compressed_payload)
    payload = json.loads(uncompressed_payload)

    log_events = payload['logEvents']
    for log_event in log_events:
        log_entry = {
            'timestamp': log_event['timestamp'],
            'message': log_event['message'],
            'logGroup': payload['logGroup'],
            'logStream': payload['logStream']
        }
        
        # Determine index name (e.g., cwl-YYYY.MM.DD)
        index_name = 'cwl-' + datetime.datetime.now().strftime('%Y.%m.%d')
        url = f"https://{ELASTICSEARCH_ENDPOINT}/{index_name}/_doc"
        
        req = urllib.request.Request(url, data=json.dumps(log_entry).encode('utf-8'))
        req.add_header('Content-Type', 'application/json')
        
        try:
            response = urllib.request.urlopen(req)
            print(f"Log sent: {response.status}")
        except Exception as e:
            print(f"Error sending log: {str(e)}")
            
    return {'statusCode': 200, 'body': json.dumps('Logs processed')}
