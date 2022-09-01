/* eslint-disable prettier/prettier */

import { HandPalm, Play } from "phosphor-react";


import { HomeContainer, StartCountdownButton, StopCountdownButton } from "./styles";
import { createContext, useEffect, useState } from "react";
import { NewCycleForm } from "./components/NewCycleForm";
import { Countdown } from "./components/Countdown";



interface Cycle {
  id: string;
  task: string;
  minutesAmount: number;
  startDate: Date;
  interruptedDate?: Date;
  finishedDate?: Date;
}

interface CyclesContextType {
  activeCycle: Cycle | undefined;
  activeCyclesId: string | null;
  markCurrentCycleAsFinished: () =>void;
}

export const CyclesContext = createContext({} as CyclesContextType)

export function Home() {
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [activeCyclesId, setActiveCyclesId] = useState<string | null>(null);


  const activeCycle = cycles.find((cycle) => cycle.id === activeCyclesId)

  function markCurrentCycleAsFinished() {
    setCycles((state) => state.map((cycle) => {
      if (cycle.id === activeCyclesId) {
        return { ...cycle, finishedDate: new Date() }
      } else {
        return cycle
      }
    }),
    )
  }

  // function handleCreateNewCycle(data: NewCycleFormAmount) {
  //   const id = String(new Date().getTime())

  //   const newCycle: Cycle = {
  //     id,
  //     task: data.task,
  //     minutesAmount: data.minutesAmount,
  //     startDate: new Date(),
  //   }

  //   // Poderiamos utilizar o spreed operator para incluir no novo valor os valores antigos pois se trata de uma nova lista
  //   // Porem como semrpe que utilizamos uma função quando atualizamos um estado e ele depende da informação anterior
  //   // Devemos setar atraves de uma arrow function conceito de clousures.
  //   setCycles((state) => [...state, newCycle])
  //   setActiveCyclesId(id)
  //   setAmountSecondsPassed(0)
  //   reset();
  // }

  function handleInterruptCycle() {
    setCycles(state =>
      state.map((cycle) => {
        if (cycle.id === activeCyclesId) {
          return { ...cycle, interruptedDate: new Date() }
        } else {
          return cycle
        }
      }),
    )
    setActiveCyclesId(null);
  }


  // const task = watch("task")
  // const isSubmitDisabled = !task;


  return (
    <HomeContainer>
      <form /*onSubmit={handleSubmit(handleCreateNewCycle)}*/>
        <CyclesContext.Provider value={{activeCycle, activeCyclesId, markCurrentCycleAsFinished}}>
        {/* <NewCycleForm /> */}
        <Countdown />
        </CyclesContext.Provider>
        {activeCycle ? (
          <StopCountdownButton onClick={handleInterruptCycle} type="button">
            <HandPalm size={24} />
            Interromper
          </StopCountdownButton>
        ) : (
          <StartCountdownButton /*disabled={isSubmitDisabled}*/ type="submit">
            <Play size={24} />
            Começar
          </StartCountdownButton>
        )}
      </form>
    </HomeContainer>
  )
}
