import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, List, ListItem, ListItemText, Typography, withStyles } from '@material-ui/core';

const ToolsDialog = ({ open, onClose, tools }) => {
  if (!tools || tools.length === 0) {
    return null;
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Available Tools</DialogTitle>
      <DialogContent>
        <List>
          {tools.map((tool, index) => (
            <ListItem key={index}>
              {tool?.type === 'function' && tool.function ? (
                <ListItemText
                  primary={tool.function.name}
                  secondary={
                    <>
                      <Typography component="span" variant="body2" color="textPrimary">
                        {tool.function.description}
                      </Typography>
                      <Typography component="pre" variant="body2">
                        {JSON.stringify(tool.function.parameters, null, 2)}
                      </Typography>
                    </>
                  }
                />
              ) : (
                <ListItemText
                  primary="Unknown Tool Type"
                  secondary={
                    <Typography component="pre" variant="body2">
                      {JSON.stringify(tool, null, 2)}
                    </Typography>
                  }
                />
              )}
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default withStyles((theme) => ({
  dialogTitle: {
    fontSize: '1.5rem',
    fontWeight: 500,
  },
  dialogContent: {
    padding: theme.spacing(2),
  },
  button: {
    backgroundColor: theme.palette.primary.main,
  },
}))(ToolsDialog);
