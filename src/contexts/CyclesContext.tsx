/* eslint-disable prettier/prettier */
import { createContext, ReactNode, useReducer, useState } from 'react'

interface CreateCycleData {
  task: string;
  minutesAmount: number;
}

interface Cycle {
  id: string;
  task: string;
  minutesAmount: number;
  startDate: Date;
  interruptedDate?: Date;
  finishedDate?: Date;

}

interface CyclesContextType {
  cycles: Cycle[]
  activeCycle: Cycle | undefined
  activeCyclesId: string | null
  markCurrentCycleAsFinished: () => void
  amountSecondsPassed: number
  setSecondsPassed: (seconds: number) => void
  createNewCycle: (data: CreateCycleData) => void;
  interruptCurrentCycle: () => void;
}

export const CyclesContext = createContext({} as CyclesContextType)

interface CyclesContextProviderProps {
  children: ReactNode
}

interface CyclesState {
  cycles: Cycle[]
  activeCyclesId: string | null
}

export function CyclesContextProvider({ children }: CyclesContextProviderProps) {
  const [cyclesState, dispatch] = useReducer((state: CyclesState, action: any) => {
    switch (action.type) {
      case "ADD_NEW_CYCLE":
        return {
          ...state,
          cycles: [...state.cycles, action.payload.newCycle],
          activeCyclesId: action.payload.newCycle.id,
        }
      case 'INTERRUPT_CURRENT_CYCLE':
        return {
          ...state,
          cycles: state.cycles.map((cycle) => {
            if (cycle.id === state.activeCyclesId) {
              return { ...cycle, interruptedDate: new Date() }
            } else {
              return cycle
            }
          }),
          activeCyclesId: null,
        }
      case 'MARK_CURRENT_CYCLE_AS_FINISHED':
        return {
          ...state,
          cycles: state.cycles.map((cycle) => {
            if (cycle.id === state.activeCyclesId) {
              return { ...cycle, finishedDate: new Date() }
            } else {
              return cycle
            }
          }),
          activeCyclesId: null,
        }
      default:
        return state
    }
  },

    {
      cycles: [],
      activeCyclesId: null,
    },
  )

  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)

  const { cycles, activeCyclesId } = cyclesState;

  const activeCycle = cycles.find((cycle) => cycle.id === activeCyclesId)

  function setSecondsPassed(seconds: number) {
    setAmountSecondsPassed(seconds)
  }

  function markCurrentCycleAsFinished() {
    dispatch({
      type: 'MARK_CURRENT_CYCLE_AS_FINISHED',
      payload: {
        activeCyclesId,
      },
    })

  }

  function createNewCycle(data: CreateCycleData) {
    const id = String(new Date().getTime())

    const newCycle: Cycle = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    }
    dispatch({
      type: 'ADD_NEW_CYCLE',
      payload: {
        newCycle,
      },
    })
    // Poderiamos utilizar o spreed operator para incluir no novo valor os valores antigos pois se trata de uma nova lista
    // Porem como semrpe que utilizamos uma função quando atualizamos um estado e ele depende da informação anterior
    // Devemos setar atraves de uma arrow function conceito de clousures.

    setAmountSecondsPassed(0)
  }

  function interruptCurrentCycle() {
    dispatch({
      type: 'INTERRUPT_CURRENT_CYCLE',
      payload: {
        activeCyclesId,
      },
    })
    
    
  }
  
    return(
        <CyclesContext.Provider value={{cycles, activeCycle, activeCyclesId, markCurrentCycleAsFinished, amountSecondsPassed, setSecondsPassed, createNewCycle, interruptCurrentCycle}}>
            {children}
        </CyclesContext.Provider>
    )
}