import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/shared/ui';
import { Plus } from 'lucide-react';

export const ClubFormDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          동아리 추가
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>동아리 추가</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">동아리명</Label>
            <Input id="name" placeholder="동아리명 입력" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">동아리 타입</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="타입 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="전공">전공</SelectItem>
                <SelectItem value="취업">취업</SelectItem>
                <SelectItem value="자율">자율</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end">
          <Button>추가</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
