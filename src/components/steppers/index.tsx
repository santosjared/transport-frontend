import { Card, CardContent,Divider,Step, StepLabel, Stepper, Typography } from "@mui/material"
import { Fragment, ReactNode } from "react"
import StepperWrapper from "src/@core/styles/mui/stepper"
import StepperCustomDot from "./StepperCustomDot"

type steper = {
  title:string;
}
interface Props {
  activeStep:number;
  steps:steper[];
  children?:ReactNode;
}
const Steppers = ({activeStep,steps,children}:Props)=>{  
  return (
  <Fragment>
    <StepperWrapper>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((step, index) => {
          return (
            <Step key={index}>
              <StepLabel StepIconComponent={StepperCustomDot}>
                <div className='step-label'>
                  <div>
                    <Typography className='step-title'>{step.title}</Typography>
                  </div>
                </div>
              </StepLabel>
            </Step>
          )
        })}
      </Stepper>
    </StepperWrapper>
    <Divider/>
      <CardContent>{children}</CardContent>
  </Fragment>
)
}

export default Steppers;