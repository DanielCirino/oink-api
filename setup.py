from setuptools import setup, find_packages


def getRequirements(filename):
  return [req.strip()
          for req
          in open(filename).readlines()
          ]


setup(
  name="oink_api",
  version="0.1.0",
  description="API sistema Oink - Finanças Pessoais",
  packages=find_packages(),
  include_package_data=True,
  install_requires=getRequirements("requirements.txt"),
  extras_require={
    "dev": [getRequirements("requirements-dev.txt")]
  })
