import { GameEngine, GameEngineProps, GameSettings, GameStatus, GameSystem } from '@game-canvas-2d/data-access';
import { MutableRefObject, useEffect, useState } from 'react';

export interface UseGameplayReturn { play: () => void, replay: () => void, status: GameStatus, score: number | undefined }

export interface UseGameplayProps {
  ref: MutableRefObject<HTMLCanvasElement | null>
}

export function useGameplay({ ref }: UseGameplayProps): UseGameplayReturn {
  const [game, setGame] = useState<GameSystem | null>(null)
  const [status, setStatus] = useState<GameStatus>('idle')
  const [ping, setPing] = useState<number>(0)

  useEffect(() => {
    if (ref.current) {
      GameSettings.SCREEN_WIDTH = window.innerWidth
      GameSettings.SCREEN_HEIGHT = window.innerHeight
      if (GameSettings.SCREEN_WIDTH < 768) {
        GameSettings.BALL_NUMBERS = 50
      }
      ref.current.width = GameSettings.SCREEN_WIDTH
      ref.current.height = GameSettings.SCREEN_HEIGHT

      const gameEngine = new GameEngine({ canvas: ref.current } as GameEngineProps)
      const gameSystem = new GameSystem({ engine: gameEngine, ping: setPing })

      gameSystem.init()

      setGame(gameSystem)
    }
  }, [])

  const play = () => {
    if (!game) return

    game.start()
    game.getSounds().play({ key: 'click' })
    setStatus(game.getStatus())
  }

  const replay = () => {
    if (!game) return

    game.reset()
    game.getSounds().play({ key: 'click' })
    setStatus(game.getStatus())
  }

  useEffect(() => {
    if (!game) return

    setStatus(game.getStatus())
  }, [ping])

  const score = game?.getScore();

  return { play, replay, status, score }
}

export default useGameplay;
