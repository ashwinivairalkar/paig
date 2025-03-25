import os  # ✅ Ensure this is at the top
import sys
import yaml
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))
from functools import lru_cache
import logging
import re
from core.utils import recursive_merge_dicts
from core import constants
from paig_securechat.core import preprocess_config


Config: dict = {}
logger = logging.getLogger(__name__)
DEFAULT_CONFIG_PATH = 'configs'

def replace_pattern_with_env(yaml_str):
    """Replace ${ENV_VARIABLE} with actual environment variable values."""
    pattern = r'\$\{{(\w+)\}}'

    def replace(match):
        env_var_name = match.group(1)
        return preprocess_config.normalize_path(os.environ.get(env_var_name, match.group(0)))  # Normalize paths

    return re.sub(pattern, replace, yaml_str)

@lru_cache
def load_config_file():
    """Load and merge YAML config files, handling OS-specific paths."""
    config_path = preprocess_config.normalize_path(os.getenv('CONFIG_PATH', DEFAULT_CONFIG_PATH))
    custom_config_path = preprocess_config.normalize_path(os.getenv('EXT_CONFIG_PATH', ""))
    env = os.getenv('SECURE_CHAT_DEPLOYMENT', 'default')

    default_config_file = preprocess_config.normalize_path(os.path.join(config_path, 'default_config.yaml'))
    if constants.MODE == 'standalone':
        default_config_file = preprocess_config.normalize_path(os.path.join(config_path, 'standalone_config.yaml'))

    if not os.path.exists(default_config_file):
        sys.exit(f'No default config file found at {default_config_file}')

    with open(default_config_file, 'r') as f:
        yaml_str = f.read()

    yaml_str_modified = replace_pattern_with_env(yaml_str)
    default_config = yaml.safe_load(yaml_str_modified)

    custom_config_file = preprocess_config.normalize_path(os.path.join(config_path, f'{env}_config.yaml'))
    if custom_config_path and os.path.exists(os.path.join(custom_config_path, f'{env}_config.yaml')):
        custom_config_file = preprocess_config.normalize_path(os.path.join(custom_config_path, f'{env}_config.yaml'))

    if os.path.exists(custom_config_file) and custom_config_file != default_config_file:
        logger.info(f'Found custom config at {custom_config_file}')
        with open(custom_config_file, 'r') as f:
            custom_config = yaml.safe_load(f)
        if custom_config and isinstance(custom_config, dict):
            default_config = recursive_merge_dicts(default_config, custom_config)

    logger.info(f"Final config: {default_config}")
    return default_config
