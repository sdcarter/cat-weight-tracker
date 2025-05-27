import warnings

# Filter out deprecation warnings
warnings.filterwarnings("ignore", category=PendingDeprecationWarning, module="starlette.formparsers")
warnings.filterwarnings("ignore", category=DeprecationWarning, module="passlib.utils")
warnings.filterwarnings("ignore", category=DeprecationWarning, message="Support for class-based `config` is deprecated")