import { AlertDialog, Button } from "@fuel-ui/react";

export type ConfirmProps = {
  header: string;
  content: string;
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function Confirm({
  header,
  content,
  open,
  onCancel,
  onConfirm,
}: ConfirmProps) {
  return (
    <AlertDialog open={open}>
      <AlertDialog.Content>
        <AlertDialog.Heading>{header}</AlertDialog.Heading>
        <AlertDialog.Description>{content}</AlertDialog.Description>
        <AlertDialog.Footer>
          <AlertDialog.Cancel>
            <Button color="gray" variant="ghost" onPress={onCancel}>
              Cancel
            </Button>
          </AlertDialog.Cancel>
          <AlertDialog.Action>
            <Button variant="outlined" color="tomato" onPress={onConfirm}>
              Confirm
            </Button>
          </AlertDialog.Action>
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog>
  );
}
