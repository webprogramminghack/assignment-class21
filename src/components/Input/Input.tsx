import { ChangeEventHandler, FC, HTMLInputTypeAttribute } from 'react'
import styles from './Input.module.scss'

type InputType = {
  type?: HTMLInputTypeAttribute | undefined;
  placeholder?: string | undefined;
  value?: string | readonly string[] | number | undefined;
  onChange?: ChangeEventHandler<HTMLInputElement>;
}

export const Input: FC<InputType> = ({
  type = 'text',
  onChange = () => {},
  ...rest
}) => {
  return (
    <input className={styles.input} type={type} onChange={onChange} {...rest} />
  )
}