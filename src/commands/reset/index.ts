import { existsSync, rmSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'
import { getGlobalClaudeFile } from '../../utils/env.js'
import { getClaudeConfigHomeDir } from '../../utils/envUtils.js'
import type { Command } from '../../commands.js'

const reset: Command = {
  type: 'local',
  name: 'reset',
  description: 'Reset OpenCodex config/state — deletes ~/.openclaude.json and ~/.openclaude/ folder',
  aliases: [],
  supportsNonInteractive: true,
  async run() {
    const deletedPaths: string[] = []

    // 1. Delete global config file (~/.openclaude.json or ~/.config.json)
    const configFile = getGlobalClaudeFile()
    if (existsSync(configFile)) {
      rmSync(configFile, { force: true })
      deletedPaths.push(configFile)
    }

    // 2. Delete config home directory (~/.openclaude/)
    const configDir = getClaudeConfigHomeDir()
    if (existsSync(configDir)) {
      rmSync(configDir, { recursive: true, force: true })
      deletedPaths.push(configDir)
    }

    // 3. Also delete legacy files just in case
    const home = homedir()
    const legacyConfigFile = join(home, '.openclaude.json')
    if (legacyConfigFile !== configFile && existsSync(legacyConfigFile)) {
      rmSync(legacyConfigFile, { force: true })
      deletedPaths.push(legacyConfigFile)
    }

    const legacyConfigDir = join(home, '.openclaude')
    if (legacyConfigDir !== configDir && existsSync(legacyConfigDir)) {
      rmSync(legacyConfigDir, { recursive: true, force: true })
      deletedPaths.push(legacyConfigDir)
    }

    if (deletedPaths.length === 0) {
      console.log('Nothing to reset — no config files found.')
      return
    }

    console.log(`Reset complete. Deleted:\n${deletedPaths.join('\n')}`)
  },
}

export default reset
