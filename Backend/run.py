import sys
import os

backend_dir = os.path.dirname(os.path.abspath(__file__))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

import uvicorn
from app.core.config import settings

if __name__ == '__main__':
    port = int(os.environ.get('PORT', settings.PORT or 8000))
    host = os.environ.get('HOST', settings.HOST or '0.0.0.0')
    print('\n' + '='*70)
    print(' KOYLA DRISHTI: AI-Powered Smart Governance & Compliance Backend')
    print(f' Starting FastAPI service on http://localhost:{port}')
    print(f' API Documentation: http://localhost:{port}/docs')
    print('='*70 + '\n')
    uvicorn.run('app.main:app', host=host, port=port, reload=False)
