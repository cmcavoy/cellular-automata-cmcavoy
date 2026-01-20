# Cellular Automata Visualizer Overview

## Purpose

This project is an interactive web application that visualizes elementary cellular automata - mathematical systems where simple rules create complex emergent patterns. The application demonstrates how binary rules applied to a row of cells can generate intricate visual patterns over successive generations. This educational tool helps users understand the fundamental concepts behind cellular automata, famously studied by Stephen Wolfram and described in his book "A New Kind of Science."

The code is based on examples from Daniel Shiffman's "The Nature of Code" book, adapted for web presentation with a retro NES-style interface.

## Key Features

- **256 Elementary Rules**: Supports all 256 elementary cellular automata rules (numbered 0-255 following Wolfram notation)
- **Interactive Rule Selection**: Users can specify a rule via URL parameter (`?id=110`) or let the system generate a random rule
- **Real-time Visualization**: Uses p5.js to render generations in real-time as black and white grid patterns
- **Responsive Design**: Canvas adapts to browser window size
- **No Installation Required**: Runs entirely in the browser with no build process or dependencies to install
- **Retro Aesthetic**: Styled with NES.css for a nostalgic 8-bit gaming appearance
- **Educational Links**: Includes references to "The Nature of Code" book for further learning
- **Remixable on Glitch**: Originally designed to be easily forked and modified on Glitch.com

## Target Audience

**Primary Audience:**
- Students learning about cellular automata, complexity theory, or generative art
- Educators teaching computational thinking or emergence in complex systems
- Creative coders interested in generative patterns and algorithmic art
- Anyone curious about how simple rules create complex behavior

**Secondary Audience:**
- Web developers learning p5.js or canvas-based graphics
- Developers exploring Glitch.com as a platform for educational projects
- Fans of retro gaming aesthetics

**Skill Level:**
- Users: No programming knowledge required
- Remixers/Contributors: Basic JavaScript and HTML understanding helpful

## Quick Start

### Viewing the Application

Visit the live demo at: https://cellular-automata-cmcavoy.glitch.me/

Try different rules by adding `?id=` to the URL:
- Rule 30 (chaotic): `?id=30`
- Rule 110 (Turing complete): `?id=110`
- Rule 90 (Sierpinski triangle): `?id=90`

### Running Locally

1. Clone this repository
2. Serve the files using any static web server:
   ```bash
   python3 -m http.server 8000
   ```
3. Open http://localhost:8000 in your browser

### Understanding the Output

- Each row represents one generation of the cellular automata
- Black cells = state 1 (alive/on)
- White cells = state 0 (dead/off)
- The top row is generation 0 (single cell in the center)
- Each subsequent row is computed from the row above it
- The rule number is displayed in the page title

### Experimenting with Rules

Different rule numbers produce dramatically different patterns:
- **Rule 30**: Chaotic, unpredictable patterns
- **Rule 90**: Sierpinski triangle fractal
- **Rule 110**: Proven to be Turing complete (can perform universal computation)
- **Rule 184**: Traffic flow simulation

Try random rules by visiting the page without parameters, or systematically explore by incrementing the `?id=` value from 0 to 255.
