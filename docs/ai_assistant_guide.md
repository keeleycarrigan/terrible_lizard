# AI Assistant Guide 🤖
## Natural Language Command Translation for Terrible Lizard Monorepo

This guide helps AI assistants understand user intents and translate them into specific generator commands.

## Common User Intent Patterns

### Mobile Development
```
User Says: "start a new iOS project" | "create an iOS app" | "build an iPhone app"
AI Should Execute:
1. Determine app name (ask if not provided)
2. Run: pnpm nx g @terrible-lizard/generators:create-app {app-name} --type=ios-native --organizationIdentifier=com.terrible-lizard.{app-name-snake-case}
3. Suggest: open apps/{app-name}/{app-name}.xcodeproj

User Says: "create an Android app" | "start Android project"
AI Should Respond: "Android generator is coming in Phase 4.7.2. Currently available: iOS apps, web apps, and backend APIs."
```

### Web Development
```
User Says: "create a React app" | "start a React project" | "build a frontend"
AI Should Execute:
1. Run: pnpm nx g @terrible-lizard/generators:create-app {app-name} --framework=react --docker
2. Suggest: pnpm nx serve {app-name}

User Says: "create a Next.js app" | "build with Next.js"
AI Should Execute:
1. Run: pnpm nx g @terrible-lizard/generators:create-app {app-name} --framework=nextjs --docker
2. Note: Runs on port 3000

User Says: "create an API" | "build a REST API" | "start a backend"
AI Should Ask: "What language/framework? Options: NestJS (TypeScript), FastAPI (Python), Laravel (PHP), Symfony (PHP), Django (Python), Flask (Python)"
Then execute appropriate command based on response.
```

### Backend Development
```
User Says: "create a Python API" | "build with FastAPI" | "async Python API"
AI Should Execute: pnpm nx g @terrible-lizard/generators:create-app {app-name} --framework=fastapi --docker
Features: Async, OpenAPI docs at /docs, PostgreSQL, runs on port 8002

User Says: "create a Django app" | "build with Django" | "Python web app"
AI Should Execute: pnpm nx g @terrible-lizard/generators:create-app {app-name} --framework=django --docker
Features: Admin interface, ORM, runs on port 8001

User Says: "create a PHP API" | "build with Laravel" | "PHP backend"
AI Should Ask: "Laravel or Symfony?" 
Laravel: Port 8004, Eloquent ORM
Symfony: Port 8003, Doctrine ORM
```

## Parameter Decision Trees

### App Name Logic
```
If user provides name: Use exactly as provided
If user doesn't provide name:
  - Ask: "What would you like to name your {framework} app?"
  - Suggest pattern: "my-{framework}-app" (e.g., my-react-app, my-ios-app)
  - Validate: No spaces, use kebab-case
```

### iOS Organization Identifier Logic
```
If user provides organizationIdentifier: Use exactly as provided
If user doesn't provide:
  - Default: com.terrible-lizard.{app-name-with-underscores}
  - Example: app-name "my-ios-app" → "com.terrible-lizard.my_ios_app"
  - Ask if they want a custom organization identifier
```

### Framework Selection Logic
```
User says "API" without specifying language:
  1. Ask: "What language/framework?"
  2. Provide options: "NestJS (TypeScript), FastAPI (Python), Laravel (PHP)"
  3. Include brief descriptions of each

User says "web app" without specifying framework:
  1. Ask: "What framework?"
  2. Provide options: "React, Next.js, Angular, or basic HTML/CSS/JS"
  3. Recommend React for beginners
```

## Command Templates

### Complete Command Patterns
```yaml
iOS App:
  Command: "pnpm nx g @terrible-lizard/generators:create-app {name} --type=ios-native --organizationIdentifier={orgId}"
  Follow-up: "open apps/{name}/{name}.xcodeproj"
  
React App:
  Command: "pnpm nx g @terrible-lizard/generators:create-app {name} --framework=react --docker"
  Follow-up: "pnpm nx serve {name}"
  
FastAPI App:
  Command: "pnpm nx g @terrible-lizard/generators:create-app {name} --framework=fastapi --docker"
  Follow-up: "pnpm nx serve {name} (available at http://localhost:8002)"
  
Python Library:
  Command: "pnpm nx g @terrible-lizard/generators:create-lib {name} --type=python"
  Follow-up: "pnpm nx test {name}"
```

## Validation and Error Handling

### Prerequisites Check
```yaml
iOS Development:
  Required: macOS operating system
  Required: Xcode installed
  Auto-handled: xcnew tool (will be installed automatically)
  
General Development:
  Required: Node.js and pnpm
  Required: Nx workspace (already set up in this repo)
```

### Success Validation
```yaml
Command Success Indicators:
  - Output contains "✅ Successfully created"
  - Target directory exists (apps/{name} or libs/{name})
  - project.json file exists in target directory
  
iOS Specific:
  - .xcodeproj directory exists
  - Can run: open apps/{name}/{name}.xcodeproj
  
Web/Backend Specific:
  - Can run: pnpm nx serve {name}
  - Appropriate config files exist (package.json, pyproject.toml, composer.json)
```

## Response Templates

### Success Responses
```
iOS App Created:
"✅ iOS app '{name}' created successfully! 
🚀 Open in Xcode: open apps/{name}/{name}.xcodeproj
📱 Build and run with ⌘+R in Xcode"

Web App Created:
"✅ {Framework} app '{name}' created successfully!
🚀 Start development: pnpm nx serve {name}
📱 Open http://localhost:3000 in your browser"

Backend API Created:
"✅ {Framework} API '{name}' created successfully!
🚀 Start development: pnpm nx serve {name}
📱 API available at http://localhost:{port}
📖 Docs: http://localhost:{port}/docs (if FastAPI)"
```

### Error Responses
```
Wrong OS for iOS:
"❌ iOS development requires macOS. You can create web apps, backend APIs, or libraries instead."

Missing Parameters:
"I need a bit more info. What would you like to name your {type} app?"

Framework Not Supported:
"That framework isn't supported yet. Available options: {list current frameworks}"
```

## Advanced Patterns

### Multi-Step Workflows
```yaml
"Create a full-stack app":
  1. Ask: "What frontend? (React, Next.js, Angular)"
  2. Ask: "What backend? (NestJS, FastAPI, Laravel)"
  3. Create frontend app
  4. Create backend app
  5. Suggest how to connect them

"Set up a mobile app with API":
  1. Create iOS app
  2. Ask about backend preference
  3. Create backend API
  4. Suggest how to connect mobile app to API
```

### Context-Aware Suggestions
```yaml
If workspace is empty:
  - Suggest starting with a simple React app or iOS app
  - Offer to create a library first for shared utilities

If apps already exist:
  - Suggest creating libraries for shared functionality
  - Offer complementary technologies (if React app exists, suggest backend)

If user seems new to development:
  - Recommend React for web development
  - Recommend FastAPI for backend development
  - Provide more detailed next steps
```

## Testing the AI Assistant

### Sample Conversations
```
User: "I want to build an iPhone app"
AI: "I'll create an iOS app for you! What would you like to name it?"
User: "WeatherApp"
AI: "Creating iOS app 'WeatherApp'..."
[Runs command]
AI: "✅ iOS app 'WeatherApp' created! Open in Xcode: open apps/WeatherApp/WeatherApp.xcodeproj"

User: "Create a Python API"
AI: "I'll create a Python API! Which framework: FastAPI (modern, async) or Django (full-featured)?"
User: "FastAPI"
AI: "What would you like to name your FastAPI app?"
User: "user-service"
AI: "Creating FastAPI app 'user-service'..."
[Runs command]
AI: "✅ FastAPI app 'user-service' created! Start: pnpm nx serve user-service (http://localhost:8002)"
```

---

**This guide enables AI assistants to:**
1. Understand natural language development requests
2. Ask clarifying questions when needed
3. Execute the correct generator commands
4. Provide helpful next steps
5. Handle edge cases and errors gracefully
6. Suggest appropriate technologies for user goals 
