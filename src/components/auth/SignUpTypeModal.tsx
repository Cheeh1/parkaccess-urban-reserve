import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
  } from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Building, User } from "lucide-react";

export const SignUpTypeModal = ({ open, onSelect }) => (
    <Dialog open={open}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Select Account Type</DialogTitle>
          <DialogDescription>
            Choose if you're signing up as a user or a company.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 mt-4">
          <Button
            className="w-full h-12 flex items-center justify-center gap-2 bg-parking-primary hover:bg-parking-secondary"
            onClick={() => onSelect("user")}
          >
            <User />
            User Account
          </Button>
          <Button
            className="w-full h-12 flex items-center justify-center gap-2 bg-parking-secondary hover:bg-parking-primary"
            onClick={() => onSelect("company")}
          >
            <Building />
            Company Account
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );