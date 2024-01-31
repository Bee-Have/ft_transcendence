import React from 'react';
import { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export function useAxiosNavigation() {

	const navRef = useRef(useNavigate());

  useEffect(() => {
    const intercetpor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        switch (error?.response?.status) {
          case 401:
            navRef.current('/401');
            break;
          default:
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(intercetpor);
    };
  }, []);
}

export default function AxiosNavigation() {
  useAxiosNavigation();
  return <></>;
}