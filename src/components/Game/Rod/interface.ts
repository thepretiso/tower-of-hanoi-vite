export type RodTypes = 'source' | 'temporary' | 'destination';

export type Props = {
    type: RodTypes,
    onPress: (type: RodTypes) => void,
}
