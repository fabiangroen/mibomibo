import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { ref, set, get } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";

export default function NameChange() {
  const [name, setName] = useState("");
  const [user, setUser] = useState<string | null>(null);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) return;
      setUser(user.uid);
      const nameRef = ref(db, `cursors/${user.uid}/name`);
      get(nameRef).then((snapshot) => {
        if (snapshot.exists()) {
          setName(snapshot.val());
        }
      });
    });

    return () => {
      unsubscribe();
    };
  }, []);

  function updateName(newName: string) {
    if (!user) return;
    const nameRef = ref(db, `cursors/${user}/name`);
    set(nameRef, newName);
  }

  return (
    <div className="absolute top-4 right-4">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Change Name</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Your Name</DialogTitle>
            <DialogDescription>
              To add a name to your cursor, enter it here.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-2">
            <label htmlFor="name" className="text-sm font-medium leading-none">
              New Name
            </label>
            <Input
              maxLength={16}
              value={name}
              onChange={(e) => setName(e.target.value)}
              id="name"
              placeholder="Enter your new name"
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                onClick={() => updateName(name)}
                disabled={!user}
                variant="beer"
              >
                Confirm
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
