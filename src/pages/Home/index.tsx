/* eslint-disable prettier/prettier */

import { HandPalm, Play } from "phosphor-react";

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from "zod"
import { CountdownContainer, FormContainer, HomeContainer, MinutesAmountInput, Separetor, StartCountdownButton, StopCountdownButton, Taskinput } from "./styles";
import { useEffect, useState } from "react";
import { differenceInSeconds } from "date-fns";
import { NewCycleForm } from "./NewCycleForm";
import { Countdown } from "./Countdown";

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

interface Cycle {
  id: string;
  task: string;
  minutesAmount: number;
  startDate: Date;
  interruptedDate?: Date;
  finishedDate?: Date;
}

export function Home() {
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [activeCyclesId, setActiveCyclesId] = useState<string | null>(null);
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)

  const { register, handleSubmit, watch, reset } = useForm<NewCycleFormAmount>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0
    }
  })

  const activeCycle = cycles.find((cycle) => cycle.id === activeCyclesId)

  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0

  useEffect(() => {
    let interval: number;

    if (activeCycle) {
       interval = setInterval(() => {
        const secondsDifference = differenceInSeconds(
          new Date(), 
          activeCycle.startDate
        ) // desta forma evitamos as possiveis diferenças que podem haver 

         if (secondsDifference >= totalSeconds) {
           setCycles((state) => state.map((cycle) => {
             if (cycle.id === activeCyclesId) {
               return { ...cycle, finishedDate: new Date() }
             } else {
               return cycle
             }
           }),
           )
           setAmountSecondsPassed(totalSeconds)
           clearInterval(interval)
         } else {
           setAmountSecondsPassed(secondsDifference)
         }
       }, 1000)
    }

    return () => {
      clearInterval(interval)
    } 
  }, [activeCycle, totalSeconds, activeCyclesId])

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

  
  const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0

  const minutesAmount = Math.floor(currentSeconds / 60)
  const secondsAmount = currentSeconds % 60

  const minutes = String(minutesAmount).padStart(2, '0')
  const seconds = String(secondsAmount).padStart(2, '0')

  useEffect(() => {
    if(activeCycle){
    document.title = `${minutes}:${seconds}`
  }
  }, [minutes, seconds, activeCycle])

  const task = watch("task")
  const isSubmitDisabled = !task;
  

  return (   
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)}>
        <NewCycleForm />
        <Countdown />        

        { activeCycle ? (
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
