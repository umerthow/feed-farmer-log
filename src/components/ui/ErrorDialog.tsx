import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './dialog';
import { Button } from './button';

type ErrorDialogProps = {
  open: boolean;
  message: string | null;
  onClose: () => void;
};

const ErrorDialog = ({ open, message, onClose }: ErrorDialogProps) => (
  <Dialog open={open} onOpenChange={onClose}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Error</DialogTitle>
      </DialogHeader>
      <div className="text-red-600">{message}</div>
      <DialogFooter>
        <Button onClick={onClose}>Close</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export default ErrorDialog;