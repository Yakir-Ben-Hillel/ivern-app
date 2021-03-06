import {
  createStyles,
  Grid,
  makeStyles,
  Paper,
  Theme,
} from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import React from 'react';
const PostSkeleton: React.FC = () => {
  const useStyles = makeStyles((theme: Theme) =>
    createStyles({
      paper: {
        padding: theme.spacing(1),
        margin: 'auto',
        maxWidth: 800,
      },
    })
  );
  const classes = useStyles();
  return (
    <div>
      {[0, 1, 2, 3].map((index) => (
        <div key={index}>
          <Paper className={classes.paper}>
            <Grid container spacing={2}>
              <Grid item>
                <Skeleton height={100} width={100} />
              </Grid>
              <Grid item xs={12} sm container>
                <Grid item xs container direction='row' spacing={2}>
                  <Grid item xs>
                    <Skeleton width='40%' />
                    <Skeleton width='35%' />
                    <Skeleton width='25%' />
                  </Grid>
                </Grid>
                <Grid item xs style={{ direction: 'rtl' }}>
                  <Skeleton width='30%' />
                  <Skeleton width='35%' />
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        </div>
      ))}
    </div>
  );
};
export default PostSkeleton;
