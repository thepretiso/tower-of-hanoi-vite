import { RodTypes } from '../Rod/interface'

export type Props = {
    value: number,
    currentRod: RodTypes,
    onPress: (value: number, currentRod: RodTypes) => void,
}
