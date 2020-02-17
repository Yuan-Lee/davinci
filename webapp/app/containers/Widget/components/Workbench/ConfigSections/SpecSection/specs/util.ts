import { CheckboxChangeEvent } from 'antd/lib/checkbox'
import { RadioChangeEvent } from 'antd/lib/radio'
import { ISpecConfig } from '../types'

export const onSectionChange = (
  onChange: (
    value: string | number | boolean,
    propPath: string | string[]
  ) => void,
  propPath: keyof ISpecConfig
) => (e: CheckboxChangeEvent | RadioChangeEvent | string | number) => {
  const value: string | number | boolean = (e as CheckboxChangeEvent | RadioChangeEvent).target
  ? (
      (e as CheckboxChangeEvent | RadioChangeEvent).target.type === 'radio'
      ? (e as RadioChangeEvent).target.value
      : (e as CheckboxChangeEvent).target.checked
    )
  : (e as string | number)

  onChange(value, [].concat(propPath as string | string[]))
}
