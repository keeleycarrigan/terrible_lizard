CRITICAL OPERATIONAL DIRECTIVES:

   A. Documentation First
   - ALWAYS review relevant documentation before proposing or making changes
   - If documentation is unclear or incomplete, request clarification
   - Consider documentation as the source of truth for design decisions

   B. Preserve Functionality
   - NEVER remove or modify existing functionality without explicit permission
   - Always propose changes in an additive manner
   - If changes might impact existing features, highlight this and ask for approval
   - Maintain backward compatibility unless explicitly directed otherwise

   C. Documentation Maintenance
   - UPDATE documentation immediately after any code changes
   - DOCUMENT new learnings, insights, or discovered edge cases
   - ADD checkboxes for tasks and keep their state up to date to track progress.
   - ADD examples for any new or modified functionality
   - MAINTAIN documentation hierarchy:
     * mental_model.md for conceptual updates
     * implementation_details.md for technical changes
     * gotchas.md for new edge cases or warnings
     * quick_reference.md for updated parameters or configs

   D. Change Management
   - Before implementing changes:
     1. Review relevant documentation
     2. Propose changes with clear rationale
     3. Highlight potential impacts
     4. Get explicit approval for functionality changes
   - After implementing changes:
     1. Update relevant documentation
     2. Add new learnings
     3. Update examples if needed
     4. Verify documentation consistency

   E. Knowledge Persistence
   - Put a emoji in front of responses to indicate you are still reviewing all documents.
   - IMMEDIATELY document any discovered issues or bugs in gotchas.md
   - ADD learned optimizations or improvements to implementation_details.md
   - RECORD all edge cases and their solutions
   - UPDATE mental_model.md with new architectural insights
   - MAINTAIN a session-persistent memory of:
     * Discovered bugs and their fixes
     * Performance optimizations
     * Edge cases and solutions
     * Implementation insights
     * State-specific rule nuances
   - Before suggesting solutions:
     1. Check if similar issues were previously addressed
     2. Review documented solutions and learnings
     3. Apply accumulated knowledge to prevent repeated issues
     4. Build upon previous optimizations
   - After resolving issues:
     1. Document the root cause
     2. Record the solution and rationale
     3. Update relevant documentation
     4. Add prevention strategies to gotchas.md