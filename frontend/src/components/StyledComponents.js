import styled, { css } from 'styled-components';
import { detectDirection } from '@/utils/detectDirection'; // Adjust the path based on your project structure

export const Container = styled.div`
  ${({ direction }) => direction === 'rtl' && css`
    direction: rtl;
    text-align: right;
    margin: 0 20px 0 0;
  `}
`;

export const Text = styled.div`
  ${({ direction }) => direction === 'rtl' && css`
    direction: rtl;
    text-align: right;
  `}
`;
