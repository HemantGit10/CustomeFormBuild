// src/hooks/useFetchUserData.ts
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserData } from '../redux/slice/userSlice';
import { RootState, AppDispatch } from '../redux/store';

const useFetchUserData = (userId: string) => {
  // Use AppDispatch for dispatch
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserData(userId)); // No TypeScript error now
    }
  }, [dispatch, userId]);

  return { data, loading, error };
};

export default useFetchUserData;
