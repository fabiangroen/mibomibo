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

import { HexColorPicker } from "react-colorful";

import { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { ref, update, get } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";

import { MousePointer2 } from "lucide-react";

export default function CursorChange() {
  const [name, setName] = useState("");
  const [color, setColor] = useState("#000000");
  const [user, setUser] = useState<string | null>(null);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) return;
      setUser(user.uid);
      const myRef = ref(db, `cursors/${user.uid}/`);
      get(myRef).then((snapshot) => {
        if (snapshot.exists()) {
          setName(snapshot.val().name);
          setColor(snapshot.val().color);
        }
      });
    });

    return () => {
      unsubscribe();
    };
  }, []);

  function updateCursor(newName: string, newColor: string) {
    if (!user) return;
    const cursorRef = ref(db, `cursors/${user}/`);
    update(cursorRef, { name: newName, color: newColor });
  }

  return (
    <div className="absolute top-4 right-4">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon">
            <MousePointer2 />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Your Cursor</DialogTitle>
            <DialogDescription>
              Add a name to your cursor or change the color.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-2">
            <label htmlFor="name" className="text-sm font-medium leading-none">
              Name
            </label>
            <Input
              maxLength={16}
              value={name}
              onChange={(e) => setName(e.target.value)}
              id="name"
              placeholder="Enter your new name"
            />
          </div>
          <div className="grid gap-2 mt-4">
            <label htmlFor="color" className="text-sm font-medium leading-none">
              Color
            </label>
            <HexColorPicker
              style={{ width: "100%" }}
              color={color}
              onChange={setColor}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button onClick={() => updateCursor(name, color)} variant="beer">
                Confirm
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
