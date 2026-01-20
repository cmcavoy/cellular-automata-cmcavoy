# C4 Architecture Diagrams

This document provides C4 model diagrams for the Cellular Automata Visualizer using Mermaid syntax.

## Context Diagram

The context diagram shows how the system fits into the broader environment and who uses it.

```mermaid
graph TB
    User[User/Student<br/>Exploring Cellular Automata]

    System[Cellular Automata Visualizer<br/>Web Application]

    Browser[Web Browser<br/>Chrome, Firefox, Safari, Edge]

    p5CDN[p5.js CDN<br/>jsDelivr]
    NESCDN[NES.css CDN<br/>unpkg]
    GlitchCDN[Glitch CDN<br/>Font Assets]

    User -->|Views patterns,<br/>changes rules via URL| System
    System -->|Runs within| Browser
    System -->|Loads graphics library| p5CDN
    System -->|Loads styling| NESCDN
    System -->|Loads custom font| GlitchCDN

    style System fill:#4285f4,color:#fff
    style User fill:#34a853,color:#fff
```

## Container Diagram

The container diagram breaks down the system into its major components and shows how they interact.

```mermaid
graph TB
    subgraph Browser["Web Browser"]
        subgraph StaticFiles["Static File Container"]
            HTML[index.html<br/>HTML5 Page]
            CSS[style.css<br/>Custom Styles]
            JS[script.js<br/>Application Logic]
        end

        subgraph Runtime["JavaScript Runtime"]
            CAClass[CA Class<br/>Computation Engine]
            p5[p5.js Library<br/>Graphics Engine]
            URLParser[URL Parser<br/>Parameter Handler]
        end

        subgraph Rendering["Rendering Layer"]
            Canvas[HTML5 Canvas<br/>Visual Output]
        end
    end

    subgraph External["External Resources"]
        p5CDN[p5.js CDN]
        NESCDN[NES.css CDN]
        FontCDN[Glitch CDN]
    end

    HTML -->|Loads| JS
    HTML -->|Loads| CSS
    HTML -->|References| p5CDN
    HTML -->|References| NESCDN
    CSS -->|References| FontCDN

    JS -->|Instantiates| CAClass
    JS -->|Uses| p5
    JS -->|Uses| URLParser

    CAClass -->|Provides data to| p5
    p5 -->|Renders to| Canvas
    URLParser -->|Configures| CAClass

    style CAClass fill:#fbbc04,color:#000
    style p5 fill:#ea4335,color:#fff
    style Canvas fill:#34a853,color:#fff
```

## Component Diagram

The component diagram shows the internal structure of the script.js container in detail.

```mermaid
graph TB
    subgraph URLHandling["URL Parameter Handling"]
        URLSearch[URL SearchParams API]
        IDExtractor[ID Parameter Extractor]
    end

    subgraph CAComponent["CA Class Component"]
        Constructor[Constructor<br/>Initialize state]
        RuleConverter[toBinary<br/>Rule → Binary conversion]
        RandomRule[randomRuleSet<br/>Random generation]
        RuleEngine[rules<br/>Apply CA rule]
        GenCompute[addGeneration<br/>Compute next gen]
        StateManager[generations Array<br/>State storage]
    end

    subgraph P5Component["p5.js Integration"]
        Setup[setup Function<br/>Canvas initialization]
        Draw[draw Function<br/>Render loop]
        DrawRow[draw_row Function<br/>Row renderer]
    end

    subgraph Globals["Global State"]
        BlockSize[Block Size<br/>w = 10px]
        CanvasConfig[Canvas Configuration<br/>width, blockWidth]
        CAInstance[CA Instance<br/>ca object]
    end

    URLSearch -->|Extracts rule ID| IDExtractor
    IDExtractor -->|Passes to| Constructor

    Constructor -->|Valid ID| RuleConverter
    Constructor -->|No/Invalid ID| RandomRule
    RuleConverter -->|Sets| StateManager
    RandomRule -->|Sets| StateManager

    GenCompute -->|Reads from| StateManager
    GenCompute -->|Uses| RuleEngine
    GenCompute -->|Writes to| StateManager

    Setup -->|Configures| CanvasConfig
    Setup -->|Uses| CAInstance

    Draw -->|Calls 500x| GenCompute
    Draw -->|Calls 500x| DrawRow
    DrawRow -->|Reads from| StateManager
    DrawRow -->|Uses| CanvasConfig

    CanvasConfig -->|Configures| Constructor

    style CAComponent fill:#fbbc04,color:#000
    style P5Component fill:#ea4335,color:#fff
    style StateManager fill:#34a853,color:#fff
```

## Data Flow Diagram

This diagram shows how data flows through the system from initialization to rendering.

```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant HTML
    participant URLParser
    participant CA
    participant p5js
    participant Canvas

    User->>Browser: Navigate to URL<br/>(with optional ?id=110)
    Browser->>HTML: Load page
    HTML->>Browser: Load p5.js
    HTML->>Browser: Load script.js

    Note over URLParser: Parse URL parameters
    URLParser->>URLParser: Extract ?id value

    Note over CA: Initialize CA
    URLParser->>CA: new CA(blockWidth, id)
    CA->>CA: Convert rule to binary<br/>or generate random
    CA->>CA: Create initial state<br/>(single center cell)

    Note over p5js: p5.js Lifecycle
    p5js->>p5js: setup() - Create canvas
    p5js->>p5js: draw() - Render once

    loop For 500 generations
        p5js->>CA: nextGeneration()
        CA->>CA: Apply rules to<br/>previous generation
        CA-->>p5js: Return new generation
        p5js->>Canvas: draw_row(generation)
        Canvas-->>User: Visual output
    end

    p5js->>HTML: Update rule display
    HTML-->>User: Show rule number
```

## Deployment View

Shows how the application is deployed and accessed.

```mermaid
graph TB
    subgraph Internet
        User[End User]
        Browser[Web Browser]
    end

    subgraph GlitchPlatform["Glitch.com Platform"]
        StaticServer[Static Web Server]
        Files[Project Files<br/>index.html, script.js, style.css]
    end

    subgraph CDNs["Content Delivery Networks"]
        jsDelivr[jsDelivr CDN<br/>p5.js]
        unpkg[unpkg CDN<br/>NES.css]
        GlitchCDN[Glitch CDN<br/>Kong Font]
    end

    User -->|HTTPS Request| Browser
    Browser -->|GET /| StaticServer
    StaticServer -->|Serves| Files
    Browser -->|GET p5.js| jsDelivr
    Browser -->|GET NES.css| unpkg
    Browser -->|GET font| GlitchCDN

    Browser -->|Executes locally| Browser

    style StaticServer fill:#4285f4,color:#fff
    style Browser fill:#34a853,color:#fff

    note1[All computation happens<br/>in the browser -<br/>no server-side processing]
    note1 -.->Browser
```

## State Transition Diagram

Shows how the cellular automata state changes over time.

```mermaid
stateDiagram-v2
    [*] --> Initialization

    Initialization --> Generation0: Create initial state<br/>(single center cell)

    Generation0 --> Computing: Begin computation loop

    state Computing {
        [*] --> ReadPrevious
        ReadPrevious --> ApplyRules: For each cell
        ApplyRules --> CheckNeighbors: Get left, middle, right
        CheckNeighbors --> LookupRule: Form 3-bit index
        LookupRule --> SetNewState: ruleset[index]
        SetNewState --> NextCell: More cells?
        NextCell --> ApplyRules: Yes
        NextCell --> StoreGeneration: No
        StoreGeneration --> [*]
    }

    Computing --> Rendering: Generation computed
    Rendering --> Computing: Next generation<br/>(if count < 500)
    Rendering --> Complete: All 500 generated
    Complete --> [*]
```

## Key Architecture Decisions

### Why Client-Side Only?
- **Educational Focus**: Students can view source and experiment immediately
- **No Backend Needed**: Computation is fast enough in JavaScript
- **Easy Remixing**: Works perfectly with Glitch's instant-remix model
- **Zero Infrastructure**: No servers to maintain or scale

### Why p5.js?
- **Accessibility**: Easy for beginners to understand
- **Pedagogy**: Aligns with "Nature of Code" teaching material
- **Canvas Abstraction**: Simplifies drawing operations
- **Community**: Large educational community

### Why Array Storage?
- **Simplicity**: Easy to understand and debug
- **Pattern Analysis**: All generations available for inspection
- **Acceptable Trade-off**: 500 generations × ~140 cells = ~70KB memory
- **Future Flexibility**: Could add export or rewind features

### Why No Build Process?
- **Immediate Feedback**: Edit and refresh, no compilation
- **Lower Barrier**: No Node.js or npm knowledge required
- **Glitch Compatible**: Works with Glitch's live-editing model
- **Educational**: Source code is readable without transpilation
