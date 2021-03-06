import {
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  Grid,
  InputAdornment,
  TextField,
  Typography,
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import React from 'react';
import { Area, Game } from '../../../@types/types';
import AreaOptions from '../../dashboard/searchBar/desktop/areaOptions';
import PlatformSelect from '../../dashboard/searchBar/desktop/bootstrapInput';
interface IProps {
  edit: boolean;
  open: boolean;
  gamesLoading: boolean;
  price: string;
  platform: 'playstation' | 'xbox' | 'switch';
  description: string;
  options: Game[];
  setSellable: React.Dispatch<React.SetStateAction<boolean>>;
  setSwappable: React.Dispatch<React.SetStateAction<boolean>>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setGame: React.Dispatch<React.SetStateAction<Game | null>>;
  setArea: React.Dispatch<React.SetStateAction<Area | undefined>>;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
  setPrice: React.Dispatch<React.SetStateAction<string>>;
  setPlatform: React.Dispatch<
    React.SetStateAction<'playstation' | 'xbox' | 'switch'>
  >;
  sellable: boolean;
  swappable: boolean;
  gameError: boolean;
  areaError: boolean;
  priceError: boolean;
  descriptionError: boolean;
}
const AddPostFields: React.FC<IProps> = ({
  edit,
  open,
  gamesLoading,
  options,
  platform,
  price,
  description,
  setSellable,
  setSwappable,
  setOpen,
  setGame,
  setArea,
  setDescription,
  setPrice,
  setPlatform,
  sellable,
  swappable,
  gameError,
  areaError,
  priceError,
  descriptionError,
}) => {
  const checkboxesError = !swappable && !sellable;
  return (
    <div>
      {!edit && (
        <Autocomplete
          onChange={(event, game) => {
            setGame(game);
          }}
          id='size-small-outlined-multi'
          open={open}
          onOpen={() => setOpen(true)}
          onClose={() => setOpen(false)}
          size='medium'
          options={options}
          loading={gamesLoading}
          disableCloseOnSelect
          getOptionLabel={(option: Game) => option.name}
          renderOption={(option) => (
            <React.Fragment>
              <img
                src={option.cover}
                alt=''
                style={{
                  width: '45px',
                  marginRight: '7px',
                }}
              />
              <Typography>{option.name}</Typography>
            </React.Fragment>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              error={gameError}
              helperText={gameError ? 'Please choose a game.' : ''}
              label='Search Games'
              size='medium'
              variant='outlined'
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <React.Fragment>
                    {gamesLoading ? (
                      <CircularProgress color='inherit' size={20} />
                    ) : null}
                    {params.InputProps.endAdornment}
                  </React.Fragment>
                ),
              }}
            />
          )}
        />
      )}
      <AreaOptions
        setArea={setArea}
        size={'medium'}
        normalMargin={'normal'}
        areaError={areaError}
      />
      <TextField
        variant='outlined'
        margin='normal'
        value={description}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
          setDescription(event.target.value)
        }
        fullWidth
        error={descriptionError}
        helperText={descriptionError ? 'Please fill the section.' : ''}
        id='description'
        label='Description'
        name='description'
      />
      <Grid container style={{ marginTop: '1px' }} direction='row' spacing={3}>
        <Grid item xs>
          <PlatformSelect
            platform={platform}
            setPlatform={setPlatform}
            fullWidth={true}
          />
        </Grid>
        <Grid item xs>
          <TextField
            variant='outlined'
            size='small'
            value={price}
            error={priceError}
            helperText={priceError ? 'Please fill the section' : ''}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              if (
                /^-?\d+$/.test(event.target.value) ||
                event.target.value === ''
              )
                setPrice(event.target.value);
            }}
            fullWidth
            id='price'
            label='Price'
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>₪</InputAdornment>
              ),
            }}
          />
        </Grid>
      </Grid>
      <Grid style={{ display: 'table' }} item xs>
        <FormControl error={checkboxesError}>
          <FormGroup row>
            <FormControlLabel
              control={
                <Checkbox
                  checked={sellable}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setSellable(event.target.checked)
                  }
                  name='selling'
                />
              }
              label='Selling'
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={swappable}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setSwappable(event.target.checked)
                  }
                  name='swapping'
                />
              }
              label='Swapping'
            />
          </FormGroup>
          {checkboxesError && (
            <FormHelperText>Must choose at least one option</FormHelperText>
          )}
        </FormControl>
      </Grid>
    </div>
  );
};
export default AddPostFields;
