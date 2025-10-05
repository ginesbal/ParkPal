import { act, renderHook } from '@testing-library/react-hooks';
import { parkingAPI } from '../../services/api';
import { useParkingSpots } from '../useParkingSpots';

jest.mock('../../services/api', () => ({
    parkingAPI: {
        findNearbySpots: jest.fn(),
    },
}));

describe('useParkingSpots', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.runOnlyPendingTimers();
        jest.useRealTimers();
    });

    it('debounces API calls', async () => {
        const mockData = { data: [{ id: 1, address: 'Test' }] };
        parkingAPI.findNearbySpots.mockResolvedValue(mockData);

        const { rerender } = renderHook(
            ({ loc }) => useParkingSpots(loc, 500, 'all'),
            { initialProps: { loc: { latitude: 51.0, longitude: -114.0 } } }
        );

        // Change location 5 times rapidly
        rerender({ loc: { latitude: 51.01, longitude: -114.0 } });
        rerender({ loc: { latitude: 51.02, longitude: -114.0 } });
        rerender({ loc: { latitude: 51.03, longitude: -114.0 } });
        rerender({ loc: { latitude: 51.04, longitude: -114.0 } });
        rerender({ loc: { latitude: 51.05, longitude: -114.0 } });

        // Haven't waited 300ms - no API calls yet
        expect(parkingAPI.findNearbySpots).not.toHaveBeenCalled();

        // Fast-forward past debounce
        await act(async () => {
            jest.advanceTimersByTime(300);
        });

        // Should only call once with the LAST location
        expect(parkingAPI.findNearbySpots).toHaveBeenCalledTimes(1);
        expect(parkingAPI.findNearbySpots).toHaveBeenCalledWith(
            51.05,
            -114.0,
            500,
            {}
        );
    });

    it('handles errors properly', async () => {
        parkingAPI.findNearbySpots.mockRejectedValue(new Error('Network error'));

        const { result } = renderHook(() =>
            useParkingSpots({ latitude: 51.0, longitude: -114.0 }, 500)
        );

        await act(async () => {
            jest.advanceTimersByTime(300);
        });

        expect(result.current.error).toBe('Network error');
        expect(result.current.spots).toEqual([]);
    });
});