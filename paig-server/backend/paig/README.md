
Copy
## Contents
- [Technology Stack](#technology-stack)
- [How to Start Development Server](#developmentserver)
- [Optional Configuration](#configuration)
- [How to Start/Build Web UI](../../paig-server/frontend/README.md)
- [PAIG Server Background Mode](#backgroundmode)
- [How to Setup Database](#databsesetup)
- [Logging](#logging)

## Technology Stack <a name="technology-stack"></a>
PAIG provides a platform for AI governance. It allows users to governance and audits the data on one platform. 
<br>PAIG uses the following technologies:
* **Web Application Framework:** ReactJS
* **Backend:** FastAPI (Python)
* **Database:** Relational Database (default sqlite)

## How to Start Development Server <a name="developmentserver"></a>
### Prerequisites
* **Python:** >=3.10
* **NodeJS:** =14.17.5

### Steps to run the development web Server
1. Clone the repository.
```bash
git clone git@github.com:privacera/paig.git
Change directory to the paig-server.

bash
Copy
cd paig/paig-server
Run the script to build the web UI.

bash
Copy
cd scripts
source ./build_ui.sh
[!TIP]
Windows does not allow direct execution of .sh files in PowerShell or Command Prompt. To work around this, use Git Bash to convert the script, and then you can run it from PowerShell or Command Prompt.Follow these steps:

bash
Copy
cd paig/paig-server/scripts
dos2unix build_ui.sh
cd ..
[!TIP]
After conversion, open PowerShell or Command Prompt, navigate to the script directory, and execute the build with this command:

bash
Copy
cd scripts
bash ./build_ui.sh
cd ..
Go to the backend directory.

bash
Copy
cd backend
Create a virtual environment.

bash
Copy
python -m venv venv
OR

bash
Copy
python3 -m venv venv
Activate the virtual environment.

bash
Copy
source venv/bin/activate
[!TIP]
If you are using Windows, run the following command in PowerShell to activate the virtual environment.

bash
Copy
.\venv\Scripts\Activate.ps1
[!TIP]
For Windows Command Prompt, use the following command:

bash
Copy
venv\Scripts\activate
Install the dependencies.

bash
Copy
pip install -r requirements.txt
Change directory to the paig.

bash
Copy
cd paig
Run the web server.

bash
Copy
python __main__.py run --paig_deployment dev|prod --config_path <path to config folder> --host <host_ip> --port <port> --background <true|false>
One Such example is:

bash
Copy
python __main__.py run --paig_deployment dev --config_path conf --host "127.0.0.1" --port 4545 --background true
[!IMPORTANT]
Admin user credentials.

bash
Copy
PAIG URL: http://127.0.0.1:4545
username: admin
password: welcome1
PAIG Server Background Mode <a name="backgroundmode"></a>
PAIG can be run in the background mode by setting the background flag to true.

To Start the PAIG in the background mode:

bash
Copy
python __main__.py run --background true
[!IMPORTANT]
Please use help command to see all available options you can pass on command line.

bash
Copy
python __main__.py --help
To Stop the PAIG Server:

bash
Copy
python __main__.py stop
To Check the status of the PAIG Server:

bash
Copy
python __main__.py status
Optional Configuration <a name="configuration"></a>
PAIG provides overlay configuration. PAIG will use the default configuration provided in the default_config.yaml file.
This default configuration can be overridden by the user-provided custom configuration.
The user can provide the custom configuration in the following ways:

Create a new custom configuration file in the custom folder that is provided to the application.

The naming convention for the custom configuration file should be as follows:

bash
Copy
<ENVIRONMENT_NAME>_config.yaml
For example:

bash
Copy
dev_config.yaml
[!NOTE]
ENVIRONMENT_NAME is also referred to as PAIG_DEPLOYMENT in the application.

In a custom configuration file, the user should provide new configuration key values or override the existing configuration.

Example: custom-conf/dev_config.yaml

How to Setup Database <a name="databsesetup"></a>
PAIG supports automatic as well as manual database creation/updation. Please refer to Database for more details.
How to setup database

Logging <a name="logging"></a>
PAIG provides a way to configure logging configurations and level.
You can edit logging configuration to customize logging for PAIG.

Copy

This version:
1. Is completely continuous without separated blocks
2. Maintains all formatting (headings, lists, code blocks)
3. Preserves all special markdown syntax
4. Can be copied and pasted as a single unit
5. Keeps all the original content exactly as you provided it