import type { Move } from 'chess-types';
import React from 'react';
import { useContext, useState } from 'react';
import { Context as BeeContext, zeroPostageId } from '../providers/bee';
import { Context as ChessContext } from '../providers/chess-engine';
import { Context as isAIcheckedContext } from '../providers/ai-checked';
import { setSwarmHashToUrl, uploadString } from '../utils/swarm-game-data';

function printHistory(history: Move[]): string {
  return JSON.stringify(history,)
}

export default function Menu() {
  const { bee } = useContext(BeeContext)
  const { game } = useContext(ChessContext)
  const { setChecked } = useContext(isAIcheckedContext)
  const [stateHash, setStateHash] = useState('')
  const [stateUrl, setStateUrl] = useState('')
  const [checked, setCheckboxChecked ] = useState(false)

  async function uploadToSwarm() {
    if (!bee) return

    const resp = await bee.uploadData(zeroPostageId, uploadString(game.fen(), game.history()))
    setStateUrl(setSwarmHashToUrl(resp.reference))
    setStateHash(resp.reference)
  }

  const handleChange = () => {
    setChecked(!checked)
    setCheckboxChecked(!checked)
  };

  return (

    <div>
      <div>
        <button onClick={() => uploadToSwarm()}>Upload to Swarm</button>
      </div>
      <div>
        <button onClick={() => alert(printHistory(game.history({ verbose: true })))}>History</button>
      </div>
      <div>

        <label>
          <input type="checkbox"
            checked={checked}
            onChange={handleChange} />
          play with AI
        </label>

      </div>
      <div hidden={!stateHash}>
        State of the game has been uploaded with reference: {stateHash} <br />
        `You can load the game by <a href={stateUrl}>this URL</a>
      </div>
    </div>
  )
}
