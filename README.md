# Text2Voice: Convert Text to Voice
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.10](https://img.shields.io/badge/python-3.10-blue.svg)](https://www.python.org/downloads/release/python-3100/)
[![Issues](https://img.shields.io/github/issues/PranjalPanging/Video-MP3-Converter)](https://github.com/PranjalPanging/Video-MP3-Converter/issues)
[![GitHub stars](https://img.shields.io/github/stars/PranjalPanging/Video-MP3-Converter?style=social)](https://github.com/PranjalPanging/Video-MP3-Converter/stargazers)

## Overview

Text2Voice is a Python Flask web application that converts text into speech using Google Text-to-Speech (gTTS). It allows users to select from different voice styles and download the generated audio. The application bundles `ffmpeg` for cross-platform compatibility.

**Key Features:**

- Converts user-input text to speech in real-time.
- Offers multiple voice presets (normal, male, female, robot, calm).
- Enables users to download generated audio as MP3 with a custom filename.
- Provides cross-platform support using a project-local ffmpeg.
- Features a simple web interface with routes `/` (home) and `/about`.

## Tech Stack

-   **Backend:** Python 3.10, Flask, Flask-CORS
-   **Text-to-Speech:** gTTS
-   **Audio Processing:** pydub, ffmpeg (bundled)
-   **Frontend:** HTML/CSS (templates folder)

## Project Structure

-   `app.py`: Main Flask application file.
-   `requirements.txt`: Lists Python dependencies.
-   `runtime.txt`: Specifies the Python version for deployment (e.g., `python-3.10.12`).
-   `ffmpeg/bin/`: Contains ffmpeg executables for audio processing.
-   `templates/`: Contains HTML templates for the web interface.
-   `static/`: (Optional) Contains static files like CSS, JavaScript, or images.
-   `LICENSE`: Contains the MIT license information.

## Installation

1.  **Prerequisites:**

    -   Python 3.10 or a compatible version.
    -   `pip` package installer.
    -   Git (for cloning the repository).

2. **Clone the Repository:**

You can clone the repository using `git` from the command line, VS Code, or other IDEs.

**Using VS Code:**

a. Open VS Code.  
b. Open the terminal (View > Terminal).  
c. Navigate to the directory where you want to clone the repository using the `cd` command.  
d. Run the following command:

```bash
git clone https://github.com/PranjalPanging/Text2Voice.git
```

3.    **Cloning in Other IDEs:**

  The process is generally similar in other IDEs that support Git integration. Look for options like "Clone Repository" or similar in your IDE's Git menu.
    

4.  **Create and Activate a Virtual Environment (Recommended):**

    It's recommended to use a virtual environment to isolate the project dependencies.

bash
    python -m venv venv
    5.  **Install Dependencies:**

        This will start the Flask development server. By default, it will be accessible at `http://127.0.0.1:5000/`. Using `127.0.0.1` instead of `localhost` can sometimes resolve connectivity issues.

## Example Usage

-   Open your web browser and navigate to `http://127.0.0.1:5000/`.
-   Enter the text you want to convert to speech in the text area.
-   Select a voice preset from the dropdown menu.
-   Enter a desired filename for the audio file (without the extension).
-   Click the "Convert to Speech" button.
-   The generated audio will be played in the browser, and a download link will be provided.

## Configuration

- **Port Configuration:**

    The application runs on port 5000 by default. You can specify a different port using the `PORT` environment variable:

    ```bash
    # Linux/macOS
    export PORT=8000

    # Windows
    set PORT=8000

    # Run the app
    python app.py
    ```

- **Bug Reports:**

    - Submit detailed bug reports on the [project's issue tracker](https://github.com/pranjalPanging/Text2Voice/issues).  
    - Include steps to reproduce the bug, expected behavior, and actual behavior.

2.  **Feature Requests:**

    -   Submit feature requests on the [project's issue tracker](https://github.com/pranjalPanging/Text2Voice/issues).
    -   Describe the proposed feature and explain its benefits.

3.  **Code Contributions:**

    -   Fork the repository.
    -   Create a new branch for your feature or bug fix.
    -   Submit a pull request with a clear description of your changes.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Connect with Me

- Instagram: [Pangnosis](https://www.instagram.com/pangnosis)  
- LinkedIn: [Pranjal Panging](https://www.linkedin.com/in/pranjalpanging)  
- GitHub: [Pranjal Panging](https://github.com/PranjalPanging)
