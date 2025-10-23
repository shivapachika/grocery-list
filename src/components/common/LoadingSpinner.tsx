import { Center, Spinner, SpinnerProps } from '@chakra-ui/react';

interface LoadingSpinnerProps extends SpinnerProps {
  fullScreen?: boolean;
}

export function LoadingSpinner({ fullScreen = false, ...props }: LoadingSpinnerProps) {
  const spinner = <Spinner size="xl" {...props} />;

  if (fullScreen) {
    return <Center h="100vh">{spinner}</Center>;
  }

  return <Center py={8}>{spinner}</Center>;
}
