/* eslint-disable prettier/prettier */

import { HandPalm, Play } from "phosphor-react";


import { HomeContainer, StartCountdownButton, StopCountdownButton } from "./styles";
import { createContext, useState } from "react";
import { NewCycleForm } from "./components/NewCycleForm";
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from "zod"
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
  amountSecondsPassed: number;
  setSecondsPassed: (seconds: number) => void;
}

export const CyclesContext = createContext({} as CyclesContextType)

const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, 'Informe a tarefa'),
  minutesAmount: zod.number()
  .min(1, 'O ciclo precisa ser de no mínimo 5 minutos.')
  .max(60, 'O ciclo precisa ser de no máximo 60 minutos.'),
})

// geralmente utilizamos o interface para criar uma tipagem nova para um objeto novo
// interface NewCycleFormAmount {
//   task: string;
//   minutesAmount: number;
// }

// type é melhor utilizado para quando inferimos a tipagem de um objeto que já existe 
type NewCycleFormAmount = zod.infer<typeof newCycleFormValidationSchema>

export function Home() {
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [activeCyclesId, setActiveCyclesId] = useState<string | null>(null);
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)

  const newCycleForm = useForm<NewCycleFormAmount>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0
    }
  })

  const {  handleSubmit, watch, reset } = newCycleForm

  const activeCycle = cycles.find((cycle) => cycle.id === activeCyclesId)

  function setSecondsPassed(seconds: number) {
    setAmountSecondsPassed(seconds)
  }

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

  function handleCreateNewCycle(data: NewCycleFormAmount) {
    const id = String(new Date().getTime())

    const newCycle: Cycle = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    }

    // Poderiamos utilizar o spreed operator para incluir no novo valor os valores antigos pois se trata de uma nova lista
    // Porem como semrpe que utilizamos uma função quando atualizamos um estado e ele depende da informação anterior
    // Devemos setar atraves de uma arrow function conceito de clousures.
    setCycles((state) => [...state, newCycle])
    setActiveCyclesId(id)
    setAmountSecondsPassed(0)
    reset();
  }

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


  const task = watch("task")
  const isSubmitDisabled = !task;


  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)}>
        <CyclesContext.Provider value={{activeCycle, activeCyclesId, markCurrentCycleAsFinished, amountSecondsPassed, setSecondsPassed}}>
        <FormProvider {...newCycleForm}>
          <NewCycleForm />
        </FormProvider> 
        <Countdown />
        </CyclesContext.Provider>
        {activeCycle ? (
          <StopCountdownButton onClick={handleInterruptCycle} type="button">
            <HandPalm size={24} />
            Interromper
          </StopCountdownButton>
        ) : (
          <StartCountdownButton disabled={isSubmitDisabled} type="submit">
            <Play size={24} />
            Começar
          </StartCountdownButton>
        )}
      </form>
    </HomeContainer>
  )
}
