import { act, renderHook } from '@testing-library/react';
import * as React from 'react';

import useGameplay from './use-gameplay';

describe('useGameplay', () => {
  it('should render successfully', () => {
    const { result } = renderHook(() => useGameplay());

    expect(result.current.count).toBe(0);

    act(() => {
      result.current.increment();
    });

    expect(result.current.count).toBe(1);
  });
});
