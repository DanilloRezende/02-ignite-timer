/* eslint-disable prettier/prettier */

import { Play } from "phosphor-react";

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from "zod"
import { CountdownContainer, FormContainer, HomeContainer, MinutesAmountInput, Separetor, StartCountdownButton, Taskinput } from "./styles";
import { useEffect, useState } from "react";
import { differenceInSeconds } from "date-fns/esm";

const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, 'Informe a tarefa'),
  minutesAmount: zod.number()
  .min(5, 'O ciclo precisa ser de no mínimo 5 minutos.')
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

  useEffect(() => {
    if (activeCycle) {
      setInterval(() => {
        setAmountSecondsPassed(
          differenceInSeconds(new Date(), activeCycle.startDate))// desta forma evitamos as possiveis diferenças que podem haver 
      }, 1000)
    }
  }, [activeCycle])

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

    reset();
  }  

  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0
  const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0

  const minutesAmount = Math.floor(currentSeconds / 60)
  const secondsAmount = currentSeconds % 60

  const minutes = String(minutesAmount).padStart(2, '0')
  const seconds = String(secondsAmount).padStart(2, '0')


  const task = watch("task")
  const isSubmitDisabled = !task;
  

  return (   
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
        <FormContainer>
          <label htmlFor="task">Vou trabalhar em</label>
          <Taskinput 
            id="task" 
            list="task-suggestions" 
            placeholder="Dê um nome para o seu projeto" 
            {...register('task')}
          />

          <datalist id="task-suggestions">
            <option value="Projeto 1" />
            <option value="Projeto 2" />
            <option value="Projeto 3" />
            <option value="Projeto 4" />
            <option value="Banana" />
          </datalist>

          <label htmlFor="minutesAmount">durante</label>
          <MinutesAmountInput 
            type="number" 
            id="minutesAmount" 
            placeholder="00" 
            step={5} 
            min={5} 
            max={60} 
            {...register('minutesAmount', {valueAsNumber: true} )}
          />

          <span>minutos.</span>
        </FormContainer>

        <CountdownContainer>
          <span>{minutes[0]}</span>
          <span>{minutes[1]}</span>
          <Separetor>:</Separetor>
          <span>{seconds[0]}</span>
          <span>{seconds[1]}</span>
        </CountdownContainer>

        <StartCountdownButton disabled={isSubmitDisabled} type="submit">
          <Play size={24} />
          Começar
        </StartCountdownButton>
      </form>
    </HomeContainer>
  )
}
