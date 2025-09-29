import { StyleSheet } from 'react-native';
import { PALETTE } from '../../constants/theme';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: PALETTE.vanilla[800]
    },
    emptyList: { 
        flexGrow: 1 
    }
});