/* eslint-disable prettier/prettier */

import { CountdownContainer, Separetor } from "./styles";

export function Countdown() {
    <CountdownContainer>
          <span>{minutes[0]}</span>
          <span>{minutes[1]}</span>
          <Separetor>:</Separetor>
          <span>{seconds[0]}</span>
          <span>{seconds[1]}</span>
        </CountdownContainer>
}