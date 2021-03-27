import React, { useState, useEffect } from "react";
import { StyleSheet } from "react-native";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
const Spinner = (props) => {
  return (
    <Box position='relative' display='inline-flex'>
      <Box
        top={0}
        left={0}
        bottom={0}
        right={0}
        position='absolute'
        display='flex'
        alignItems='center'
        justifyContent='center'>
        <CircularProgress
          variant='determinate'
          {...props}
          style={{
            marginLeft: 20,
          }}
        />
        <Typography
          variant='caption'
          component='div'
          color='textSecondary'>{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
};

const Loading = () => {
  const [progress, setProgress] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) =>
        prevProgress >= 100 ? 0 : prevProgress + 10
      );
    }, 800);
    return () => {
      clearInterval(timer);
    };
  }, []);

  return <Spinner value={progress} />;
};

export default Loading;

const styles = StyleSheet.create({});
