import logging
import sys
from pythonjsonlogger import jsonlogger
from app.core.config import settings

def setup_logging():
    logger = logging.getLogger()
    
    # Check if handlers already exist to avoid duplication
    if not logger.handlers:
        # Console Handler (JSON)
        logHandler = logging.StreamHandler(sys.stdout)
        formatter = jsonlogger.JsonFormatter(
            fmt='%(asctime)s %(levelname)s %(name)s %(message)s'
        )
        logHandler.setFormatter(formatter)
        logger.addHandler(logHandler)

        # Logstash Handler (Async)
        try:
            from logstash_async.handler import AsynchronousLogstashHandler
            logstash_handler = AsynchronousLogstashHandler(
                host='logstash', 
                port=5000, 
                database_path=None
            )
            logger.addHandler(logstash_handler)
        except ImportError:
            pass

        logger.setLevel(logging.INFO)

    # Set libraries to warning to avoid noise
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)
