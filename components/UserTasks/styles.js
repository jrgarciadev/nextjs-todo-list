import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    padding: 0,
    marginBottom: theme.spacing(4),
    backgroundColor: theme.palette.background.paper,
  },
  inputTodo: {
    padding: 20,
    width: '100%',
  },
  iconButton: {
    padding: 10,
  },
  skeleton: {
    height: '40px',
    marginTop: 10,
    marginBottom: 10,
  },
  emptyContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing(10),
  },
  sendWrapper: {
    margin: theme.spacing(1),
    position: 'relative',
  },
  addProgress: {
    color: 'var(--geist-primary)',
    position: 'absolute',
    top: -9,
    left: -11,
    zIndex: 1,
  },
  totalItemsText: {
    paddingLeft: 10,
    marginRight: 6,
    color: '#999999',
    textAlign: 'start',
  },
  inputListTodo: {
    '&:before': {
      borderBottom: '0px',
    },
  },
  listTextChecked: {
    textDecoration: 'line-through',
  },
  infoTitle: {
    padding: 0,
    margin: 0,
  },
  info: {
    color: 'var(--accents-3)',
  },
  footer: {
    display: 'flex',
  },
}));
