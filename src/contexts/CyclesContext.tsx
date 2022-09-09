/* eslint-disable prettier/prettier */
import { createContext, ReactNode, useReducer, useState } from 'react'
import { ActionTypes, Cycle, cyclesReducer } from '../reducers/cycles';

interface CreateCycleData {
  task: string;
  minutesAmount: number;
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



export function CyclesContextProvider({ children }: CyclesContextProviderProps) {
  const [cyclesState, dispatch] = useReducer(cyclesReducer,
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
      type: ActionTypes.MARK_CURRENT_CYCLE_AS_FINISHED,
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
      type: ActionTypes.ADD_NEW_CYCLE,
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
      type: ActionTypes.INTERRUPT_CURRENT_CYCLE,
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