import os
import dotenv

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
dotenv.load_dotenv('{}/.env.test'.format(ROOT_DIR))


def test_ambiente_desenvolvimento():
    os.getenv('GD_ENV') == 'dev'


if __name__ == '__main__':
    print(os.getenv('GD_ENV'))
