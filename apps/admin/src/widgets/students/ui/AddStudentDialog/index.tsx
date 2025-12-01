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

const AddStudentDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          학생 추가
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>학생 추가</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">이름</Label>
            <Input id="name" placeholder="이름 입력" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">이메일</Label>
            <Input id="email" placeholder="example@gsm.hs.kr" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="grade">학년</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="학년 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1학년</SelectItem>
                <SelectItem value="2">2학년</SelectItem>
                <SelectItem value="3">3학년</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="class">반</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="반 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1반</SelectItem>
                <SelectItem value="2">2반</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="number">번호</Label>
            <Input id="number" type="number" placeholder="번호 입력" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="department">학과</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="학과 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SW개발과">SW개발과</SelectItem>
                <SelectItem value="스마트IoT과">스마트IoT과</SelectItem>
                <SelectItem value="AI과">AI과</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="dormRoom">기숙사 호실</Label>
            <Input id="dormRoom" placeholder="호실 입력" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">구분</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="구분 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="일반학생">일반학생</SelectItem>
                <SelectItem value="학생회">학생회</SelectItem>
                <SelectItem value="기자위">기자위</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="gender">성별</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="성별 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="남">남</SelectItem>
                <SelectItem value="여">여</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="majorClub">전공 동아리</Label>
            <Input id="majorClub" placeholder="전공 동아리 입력" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="employmentClub">취업 동아리</Label>
            <Input id="employmentClub" placeholder="취업 동아리 입력" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="autonomyClub">자율 동아리</Label>
            <Input id="autonomyClub" placeholder="자율 동아리 입력" />
          </div>
        </div>
        <div className="flex justify-end">
          <Button>추가</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddStudentDialog;
