---
title: "Memory Management Across Sessions"
date: "February 05, 2026"
read_time: "12 min read"
category: "Technical"
tags: ["Memory", "Sessions", "Persistence", "Architecture"]
---

# Memory Management Across Sessions

A truly personal AI assistant remembers context from previous conversations, learns your preferences, and accumulates knowledge over time. Life OS implements sophisticated memory systems that persist across sessions.

## Memory Architecture

Life OS uses a multi-layered memory system:

```
┌─────────────────────────────────────────────────────────┐
│                    Working Memory                        │
│           (Current session, instant access)              │
├─────────────────────────────────────────────────────────┤
│                   Short-Term Memory                      │
│              (Recent conversations, 7 days)              │
├─────────────────────────────────────────────────────────┤
│                  Long-Term Memory                        │
│           (Preferences, learned patterns)               │
├─────────────────────────────────────────────────────────┤
│                   Semantic Memory                       │
│              (Knowledge base, embeddings)                │
└─────────────────────────────────────────────────────────┘
```

## Working Memory

Working memory holds the current conversation context:

```python
class WorkingMemory:
    """Holds current session state."""
    
    def __init__(self):
        self.messages = []           # Conversation history
        self.entities = {}           # Extracted entities
        self.intent = None           # Current intent
        self.context = {}            # User context (location, time, etc.)
        self.working_set = []       # Information being processed
        
    def add_message(self, role: str, content: str):
        """Add message to conversation."""
        self.messages.append({
            'role': role,
            'content': content,
            'timestamp': now()
        })
        # Keep only last 50 messages
        if len(self.messages) > 50:
            self.messages = self.messages[-50:]
```

Working memory is:
- **Fastest** - In-memory, microsecond access
- **Ephemeral** - Lost on restart unless saved
- **Private** - Never leaves the system

## Short-Term Memory

Short-term memory retains recent conversations:

```python
class ShortTermMemory:
    """Retains recent context for 7 days."""
    
    def __init__(self, ttl_days=7):
        self.storage = RedisStorage(ttl=ttl_days * 86400)
    
    async def save_conversation(self, user_id: str, messages: list):
        """Save conversation with timestamp."""
        await self.storage.save(
            key=f"conv:{user_id}:{timestamp()}",
            value=messages
        )
    
    async def get_recent(self, user_id: str, hours: int = 24) -> list:
        """Retrieve recent conversations."""
        cutoff = now() - timedelta(hours=hours)
        return await self.storage.query(
            prefix=f"conv:{user_id}:",
            after=cutoff
        )
```

### What Gets Stored

Short-term memory retains:
- Full conversation transcripts
- Task-related discussions
- Contextual clarifications
- Problem-solving attempts

### Automatic Cleanup

```yaml
# config/memory/short-term.yaml
retention:
  default_days: 7
  conversations_days: 7
  tasks_days: 14
  decisions_days: 30

cleanup:
  enabled: true
  schedule: "0 3 * * *"  # 3 AM daily
  batch_size: 1000
```

## Long-Term Memory

Long-term memory stores learned preferences and patterns:

```python
class LongTermMemory:
    """Persistent user preferences and learned behaviors."""
    
    def __init__(self):
        self.preferences = {}        # User settings
        self.behavior_patterns = {}  # Learned behaviors
        self.dislikes = {}          # Avoidance patterns
        self.skills = {}            # Acquired capabilities
        self.goals = []             # User objectives
    
    async def learn_preference(self, category: str, key: str, value: any):
        """Store a learned preference."""
        if category not in self.preferences:
            self.preferences[category] = {}
        self.preferences[category][key] = value
        
        # Also store the context of learning
        await self.memory_graph.add(
            subject=f"user:{user_id}",
            predicate="learned_preference",
            object=f"{category}:{key}",
            context={"value": str(value), "timestamp": now()}
        )
    
    async def get_preference(self, category: str, key: str) -> any:
        """Retrieve a stored preference."""
        return self.preferences.get(category, {}).get(key)
```

### Preference Categories

```
preferences/
├── communication/
│   ├── tone: formal
│   ├── detail_level: high
│   └── response_length: medium
├── workflow/
│   ├── morning_brief: true
│   ├── check_schedule_first: true
│   └── default_agents: [research, content]
├── content/
│   ├── preferred_topics: [AI, automation]
│   ├── writing_style: technical
│   └── reading_level: advanced
└── system/
    ├── notifications: minimal
    ├── auto_deploy: true
    └── debug_mode: false
```

## Semantic Memory

Semantic memory stores knowledge as embeddings for similarity search:

```python
class SemanticMemory:
    """Knowledge base with vector embeddings."""
    
    def __init__(self):
        self.embeddings = WeaviateClient()
        self.documents = QdrantCollection()
    
    async def add_knowledge(self, text: str, metadata: dict = None):
        """Store knowledge with embedding."""
        embedding = await self.get_embedding(text)
        await self.embeddings.add(
            vector=embedding,
            payload={"text": text, **(metadata or {})}
        )
    
    async def search(self, query: str, limit: int = 5) -> list:
        """Find related knowledge."""
        query_embedding = await self.get_embedding(query)
        results = await self.embeddings.search(
            query=query_embedding,
            limit=limit
        )
        return results
```

### Knowledge Organization

```
knowledge/
├── concepts/
│   ├── ai-agents.md
│   ├── automation-patterns.md
│   └── system-architecture.md
├── procedures/
│   ├── deployment.md
│   ├── troubleshooting.md
│   └── onboarding.md
├── decisions/
│   ├── 2026-01-15-model-selection.md
│   └── 2026-01-20-deployment-strategy.md
└── projects/
    ├── life-os/
    ├── website-redesign/
    └── super-swarm/
```

## Memory Retrieval

Life OS intelligently retrieves relevant memory:

```python
class MemoryRetrieval:
    """Intelligent memory retrieval system."""
    
    async def retrieve(self, query: str, user_context: dict) -> dict:
        """Retrieve contextually relevant memories."""
        
        results = {
            'working': await self.get_working(user_context),
            'recent': await self.get_recent(user_context),
            'preferences': await self.get_preferences(user_context),
            'semantic': await self.semantic_search(query, user_context),
        }
        
        # Score and rank all results
        scored = self.score_results(query, results)
        
        return {
            'memories': scored[:10],  # Top 10 most relevant
            'sources': self.cite_sources(scored)
        }
    
    def score_results(self, query: str, results: dict) -> list:
        """Score and rank memories by relevance."""
        scored = []
        
        for category, memories in results.items():
            for memory in memories:
                score = self.calculate_relevance(query, memory)
                scored.append({**memory, 'score': score, 'category': category})
        
        return sorted(scored, key=lambda x: x['score'], reverse=True)
```

## Memory Security

Memory contains sensitive personal data. Protect it:

### Encryption

```python
class EncryptedMemory:
    """Memory with automatic encryption."""
    
    def __init__(self, key: bytes):
        self.cipher = AES256Cipher(key)
    
    async def save(self, key: str, value: any):
        """Encrypt before saving."""
        json_data = json.dumps(value)
        encrypted = self.cipher.encrypt(json_data)
        await self.storage.save(key, encrypted)
    
    async def load(self, key: str) -> any:
        """Decrypt after loading."""
        encrypted = await self.storage.load(key)
        json_data = self.cipher.decrypt(encrypted)
        return json.loads(json_data)
```

### Access Control

```yaml
memory:
  access:
    # Who can read what
    read:
      user: [own_preferences, own_conversations]
      agents: [working_memory]
      admin: [all]
      
    # Who can write what
    write:
      user: [own_preferences]
      agents: [conversation_memory, learned_patterns]
      admin: [all]
```

## Memory Operations

Common memory management tasks:

### View All Memories

```bash
openclaw memory list --all --format json
```

### Search Memories

```bash
openclaw memory search "deployment procedures"
openclaw memory search "project decisions" --limit 20
```

### Export Memory

```bash
openclaw memory export --user $USER --output backup.json
```

### Clear Memory

```bash
# Clear specific category
openclaw memory clear --category short_term

# Clear all (careful!)
openclaw memory clear --all --confirm
```

## Best Practices

1. **Don't store everything** - Be selective about long-term memory
2. **Regular reviews** - Periodically review and prune memories
3. **Test retrieval** - Ensure memories can be found when needed
4. **Backup regularly** - Export memory to prevent data loss
5. **Respect privacy** - Don't store sensitive data unencrypted

## Conclusion

Memory is what transforms an AI tool into a personal assistant—one that knows your preferences, remembers your projects, and learns from interactions. The multi-layered architecture ensures speed for current tasks while accumulating wisdom over months and years of use.

Invest time in configuring memory properly upfront, and your assistant becomes more helpful over time rather than starting fresh each conversation.

---

*Technical documentation for Life OS practitioners.*
