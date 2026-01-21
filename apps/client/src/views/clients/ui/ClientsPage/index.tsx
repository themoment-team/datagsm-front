'use client';

import { useState } from 'react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Checkbox,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@repo/shared/ui';
import { Check, Copy, Pencil, Plus, Trash2, X } from 'lucide-react';

const SCOPE_CATEGORIES = [
  {
    category: '학생 정보',
    scopes: [
      {
        id: 'student:*',
        name: 'student:*',
        description: '학생 정보 모든 권한',
        level: 'all' as const,
      },
      {
        id: 'student:read',
        name: 'student:read',
        description: '학생 정보 조회',
        level: 'read' as const,
      },
    ],
  },
  {
    category: '동아리 정보',
    scopes: [
      { id: 'club:*', name: 'club:*', description: '동아리 정보 모든 권한', level: 'all' as const },
      {
        id: 'club:read',
        name: 'club:read',
        description: '동아리 정보 조회',
        level: 'read' as const,
      },
    ],
  },
  {
    category: '프로젝트 정보',
    scopes: [
      {
        id: 'project:*',
        name: 'project:*',
        description: '프로젝트 정보 모든 권한',
        level: 'all' as const,
      },
      {
        id: 'project:read',
        name: 'project:read',
        description: '프로젝트 정보 조회',
        level: 'read' as const,
      },
    ],
  },
  {
    category: 'NEIS 정보',
    scopes: [
      { id: 'neis:*', name: 'neis:*', description: 'NEIS 정보 모든 권한', level: 'all' as const },
      {
        id: 'neis:read',
        name: 'neis:read',
        description: 'NEIS 정보 조회 (학사일정/급식)',
        level: 'read' as const,
      },
    ],
  },
];

// Demo data
const demoClients = [
  {
    id: 1,
    name: 'GSM 포털',
    clientId: 'gsm_client_a1b2c3d4e5f6g7h8',
    redirectUrls: ['https://portal.gsm.hs.kr/callback', 'https://portal.gsm.hs.kr/auth/callback'],
    scopes: ['student:read', 'club:read', 'neis:read'],
  },
  {
    id: 2,
    name: '학사 관리 시스템',
    clientId: 'gsm_client_i9j0k1l2m3n4o5p6',
    redirectUrls: ['https://admin.gsm.hs.kr/oauth/callback'],
    scopes: ['student:*', 'club:*'],
  },
  {
    id: 3,
    name: '모바일 앱',
    clientId: 'gsm_client_q7r8s9t0u1v2w3x4',
    redirectUrls: ['gsm-app://callback', 'https://app.gsm.hs.kr/auth'],
    scopes: ['student:read', 'neis:read'],
  },
  {
    id: 4,
    name: '동아리 관리',
    clientId: 'gsm_client_y5z6a7b8c9d0e1f2',
    redirectUrls: ['https://club.gsm.hs.kr/oauth/redirect'],
    scopes: ['club:read', 'project:read'],
  },
];

const ClientsPage = () => {
  const [clients, setClients] = useState(demoClients);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<(typeof demoClients)[0] | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form state for add/edit
  const [formName, setFormName] = useState('');
  const [formRedirectUrls, setFormRedirectUrls] = useState<string[]>(['']);
  const [formScopes, setFormScopes] = useState<string[]>([]);

  const handleAddRedirectUrl = () => {
    setFormRedirectUrls([...formRedirectUrls, '']);
  };

  const handleRemoveRedirectUrl = (index: number) => {
    if (formRedirectUrls.length > 1) {
      setFormRedirectUrls(formRedirectUrls.filter((_, i) => i !== index));
    }
  };

  const handleRedirectUrlChange = (index: number, value: string) => {
    const newUrls = [...formRedirectUrls];
    newUrls[index] = value;
    setFormRedirectUrls(newUrls);
  };

  const handleScopeToggle = (scopeId: string) => {
    setFormScopes((prev) =>
      prev.includes(scopeId) ? prev.filter((id) => id !== scopeId) : [...prev, scopeId],
    );
  };

  const getIndentation = (level: 'all' | 'read') => {
    if (level === 'all') return 'pl-0';
    return 'pl-6';
  };

  const handleOpenAddDialog = () => {
    setFormName('');
    setFormRedirectUrls(['']);
    setFormScopes([]);
    setIsAddDialogOpen(true);
  };

  const handleOpenEditDialog = (client: (typeof demoClients)[0]) => {
    setEditingClient(client);
    setFormName(client.name);
    setFormRedirectUrls([...client.redirectUrls]);
    setIsEditDialogOpen(true);
  };

  const handleCopyClientId = (clientId: string) => {
    navigator.clipboard.writeText(clientId);
    setCopiedId(clientId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="bg-background h-[calc(100vh-4.0625rem)]">
      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">OAuth 클라이언트 관리</CardTitle>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-2" onClick={handleOpenAddDialog}>
                    <Plus className="h-4 w-4" />
                    클라이언트 추가
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>클라이언트 추가</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">클라이언트 이름</Label>
                      <Input
                        id="name"
                        placeholder="클라이언트 이름 입력"
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>리다이렉트 URL</Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleAddRedirectUrl}
                        >
                          <Plus className="mr-1 h-3 w-3" />
                          URL 추가
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {formRedirectUrls.map((url, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Input
                              placeholder="https://example.com/callback"
                              value={url}
                              onChange={(e) => handleRedirectUrlChange(index, e.target.value)}
                            />
                            {formRedirectUrls.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemoveRedirectUrl(index)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>권한 (Scopes)</Label>
                      <p className="text-muted-foreground text-xs">
                        클라이언트가 접근할 수 있는 권한을 선택하세요.
                      </p>
                      <div className="mt-2 space-y-4 rounded-md border p-4">
                        {SCOPE_CATEGORIES.map((category) => (
                          <div key={category.category}>
                            <h4 className="text-muted-foreground mb-2 text-xs font-semibold">
                              {category.category}
                            </h4>
                            <div className="space-y-2">
                              {category.scopes.map((scope) => (
                                <div
                                  key={scope.id}
                                  className={`flex items-start gap-3 ${getIndentation(scope.level)}`}
                                >
                                  <Checkbox
                                    id={`add-${scope.id}`}
                                    checked={formScopes.includes(scope.id)}
                                    onCheckedChange={() => handleScopeToggle(scope.id)}
                                  />
                                  <div className="flex-1">
                                    <label
                                      htmlFor={`add-${scope.id}`}
                                      className="cursor-pointer text-sm font-medium leading-none"
                                    >
                                      {scope.name}
                                    </label>
                                    <p className="text-muted-foreground mt-0.5 text-xs">
                                      {scope.description}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                      {formScopes.length === 0 && (
                        <p className="text-destructive text-xs">
                          권한을 최소 1개 이상 선택해주세요
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button
                      onClick={() => setIsAddDialogOpen(false)}
                      disabled={formScopes.length === 0}
                    >
                      추가
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>클라이언트 이름</TableHead>
                    <TableHead>클라이언트 ID</TableHead>
                    <TableHead>리다이렉트 URL</TableHead>
                    <TableHead>권한</TableHead>
                    <TableHead className="w-[100px]">작업</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell className="font-medium">{client.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <code className="bg-muted rounded px-2 py-1 font-mono text-xs">
                            {client.clientId}
                          </code>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => handleCopyClientId(client.clientId)}
                          >
                            {copiedId === client.clientId ? (
                              <Check className="h-3 w-3 text-green-500" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {client.redirectUrls.map((url, index) => (
                            <Badge key={index} variant="secondary" className="font-mono text-xs">
                              {url}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {client.scopes.map((scope, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {scope}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenEditDialog(client)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" title="삭제">
                                <Trash2 className="text-destructive h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>클라이언트 삭제</AlertDialogTitle>
                                <AlertDialogDescription>
                                  정말로 "{client.name}" 클라이언트를 삭제하시겠습니까? 이 작업은
                                  되돌릴 수 없으며, 해당 클라이언트를 사용하는 모든 서비스에서
                                  인증이 실패합니다.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>취소</AlertDialogCancel>
                                <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                  삭제
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="mt-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#" isActive>
                      1
                    </PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">2</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext href="#" />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>클라이언트 수정</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">클라이언트 이름</Label>
                <Input
                  id="edit-name"
                  placeholder="클라이언트 이름 입력"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>클라이언트 ID</Label>
                <div className="flex items-center gap-2">
                  <code className="bg-muted text-muted-foreground flex-1 rounded px-3 py-2 font-mono text-sm">
                    {editingClient?.clientId}
                  </code>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => editingClient && handleCopyClientId(editingClient.clientId)}
                  >
                    {copiedId === editingClient?.clientId ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>리다이렉트 URL</Label>
                  <Button type="button" variant="outline" size="sm" onClick={handleAddRedirectUrl}>
                    <Plus className="mr-1 h-3 w-3" />
                    URL 추가
                  </Button>
                </div>
                <div className="space-y-2">
                  {formRedirectUrls.map((url, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        placeholder="https://example.com/callback"
                        value={url}
                        onChange={(e) => handleRedirectUrlChange(index, e.target.value)}
                      />
                      {formRedirectUrls.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveRedirectUrl(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={() => setIsEditDialogOpen(false)}>저장</Button>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default ClientsPage;
