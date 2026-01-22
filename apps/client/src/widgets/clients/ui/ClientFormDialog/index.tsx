'use client';

import { useEffect, useState } from 'react';

import {
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
} from '@repo/shared/ui';
import { cn } from '@repo/shared/utils';
import { Pencil, Plus, X } from 'lucide-react';

import { Client, SCOPE_CATEGORIES } from '@/entities/clients';

interface ClientFormDialogProps {
  mode: 'create' | 'edit';
  client?: Client;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSubmit: (data: { name: string; redirectUrls: string[]; scopes: string[] }) => void;
}

const ClientFormDialog = ({
  mode,
  client,
  trigger,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  onSubmit,
}: ClientFormDialogProps) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? controlledOnOpenChange! : setInternalOpen;

  const [formName, setFormName] = useState('');
  const [formRedirectUrls, setFormRedirectUrls] = useState<string[]>(['']);
  const [formScopes, setFormScopes] = useState<string[]>([]);

  useEffect(() => {
    if (mode === 'edit' && client && open) {
      setFormName(client.name);
      setFormRedirectUrls([...client.redirectUrls]);
      setFormScopes([...client.scopes]);
    } else if (mode === 'create' && open) {
      setFormName('');
      setFormRedirectUrls(['']);
      setFormScopes([]);
    }
  }, [mode, client, open]);

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

  const handleSubmit = () => {
    onSubmit({
      name: formName,
      redirectUrls: formRedirectUrls.filter((url) => url.trim() !== ''),
      scopes: formScopes,
    });
    setOpen(false);
  };

  const title = mode === 'create' ? '클라이언트 추가' : '클라이언트 수정';
  const submitText = mode === 'create' ? '추가' : '저장';

  const defaultTrigger =
    mode === 'create' ? (
      <Button size="sm" className={cn('gap-2')}>
        <Plus className={cn('h-4 w-4')} />
        클라이언트 추가
      </Button>
    ) : (
      <Button variant="ghost" size="icon">
        <Pencil className={cn('h-4 w-4')} />
      </Button>
    );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger !== undefined ? (
        <DialogTrigger asChild>{trigger}</DialogTrigger>
      ) : (
        <DialogTrigger asChild>{defaultTrigger}</DialogTrigger>
      )}
      <DialogContent className={cn('max-h-[90vh] max-w-lg overflow-y-auto')}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className={cn('space-y-4 py-4')}>
          <div className={cn('space-y-2')}>
            <Label htmlFor={mode === 'create' ? 'name' : 'edit-name'}>클라이언트 이름</Label>
            <Input
              id={mode === 'create' ? 'name' : 'edit-name'}
              placeholder="클라이언트 이름 입력"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
            />
          </div>

          {mode === 'edit' && client && (
            <div className={cn('space-y-2')}>
              <Label>클라이언트 ID</Label>
              <code
                className={cn(
                  'bg-muted text-muted-foreground block rounded px-3 py-2 font-mono text-sm',
                )}
              >
                {client.clientId}
              </code>
            </div>
          )}

          <div className={cn('space-y-2')}>
            <div className={cn('flex items-center justify-between')}>
              <Label>리다이렉트 URL</Label>
              <Button type="button" variant="outline" size="sm" onClick={handleAddRedirectUrl}>
                <Plus className={cn('mr-1 h-3 w-3')} />
                URL 추가
              </Button>
            </div>
            <div className={cn('space-y-2')}>
              {formRedirectUrls.map((url, index) => (
                <div key={index} className={cn('flex items-center gap-2')}>
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
                      <X className={cn('h-4 w-4')} />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {mode === 'create' && (
            <div className={cn('space-y-2')}>
              <Label>권한 (Scopes)</Label>
              <p className={cn('text-muted-foreground text-xs')}>
                클라이언트가 접근할 수 있는 권한을 선택하세요.
              </p>
              <div className={cn('mt-2 space-y-4 rounded-md border p-4')}>
                {SCOPE_CATEGORIES.map((category) => (
                  <div key={category.category}>
                    <h4 className={cn('text-muted-foreground mb-2 text-xs font-semibold')}>
                      {category.category}
                    </h4>
                    <div className={cn('space-y-2')}>
                      {category.scopes.map((scope) => (
                        <div
                          key={scope.id}
                          className={cn('flex items-start gap-3', getIndentation(scope.level))}
                        >
                          <Checkbox
                            id={`${mode}-${scope.id}`}
                            checked={formScopes.includes(scope.id)}
                            onCheckedChange={() => handleScopeToggle(scope.id)}
                          />
                          <div className={cn('flex-1')}>
                            <label
                              htmlFor={`${mode}-${scope.id}`}
                              className={cn('cursor-pointer text-sm font-medium leading-none')}
                            >
                              {scope.name}
                            </label>
                            <p className={cn('text-muted-foreground mt-0.5 text-xs')}>
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
                <p className={cn('text-destructive text-xs')}>권한을 최소 1개 이상 선택해주세요</p>
              )}
            </div>
          )}
        </div>
        <div className={cn('flex justify-end')}>
          <Button
            onClick={handleSubmit}
            disabled={mode === 'create' && (formScopes.length === 0 || !formName.trim())}
          >
            {submitText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ClientFormDialog;
