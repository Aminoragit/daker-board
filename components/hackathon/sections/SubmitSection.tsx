'use client';

import { useState, useRef } from 'react';
import type { HackathonDetail } from '@/data/types';
import { useSubmissionStore } from '@/store/submissionStore';
import SectionTitle from '@/components/ui/SectionTitle';
import { Upload, X, FileIcon } from 'lucide-react';

const FILE_TYPES: Record<string, string> = {
  zip: '.zip,.tar.gz,.rar',
  pdf: '.pdf',
  csv: '.csv',
};

export default function SubmitSection({ detail }: { detail: HackathonDetail }) {
  const { submit } = detail.sections;
  const addSubmission = useSubmissionStore(s => s.addSubmission);
  const getSubmissionsByHackathon = useSubmissionStore(s => s.getSubmissionsByHackathon);
  const [teamName, setTeamName] = useState('');
  const [content, setContent] = useState('');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [itemInputs, setItemInputs] = useState<Record<string, string>>({});
  const [fileData, setFileData] = useState<{ name: string; size: number; base64: string } | null>(null);
  const [itemFiles, setItemFiles] = useState<Record<string, { name: string; size: number; base64: string }>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const itemFileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const fileArtifactTypes = submit.allowedArtifactTypes.filter(t => FILE_TYPES[t]);
  const hasFileUpload = fileArtifactTypes.length > 0;
  const acceptStr = fileArtifactTypes.map(t => FILE_TYPES[t]).join(',');

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, itemKey?: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = { name: file.name, size: file.size, base64: reader.result as string };
      if (itemKey) {
        setItemFiles(prev => ({ ...prev, [itemKey]: result }));
      } else {
        setFileData(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const clearFile = (itemKey?: string) => {
    if (itemKey) {
      setItemFiles(prev => {
        const next = { ...prev };
        delete next[itemKey];
        return next;
      });
      if (itemFileRefs.current[itemKey]) itemFileRefs.current[itemKey]!.value = '';
    } else {
      setFileData(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const isFileFormat = (format: string) => {
    return format === 'pdf' || format === 'zip' || format === 'csv' || format.includes('pdf');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName.trim()) return;

    if (submit.submissionItems) {
      submit.submissionItems.forEach(item => {
        const file = itemFiles[item.key];
        addSubmission({
          id: `${Date.now()}-${item.key}`,
          hackathonSlug: detail.slug,
          teamName: teamName.trim(),
          submittedAt: new Date().toISOString(),
          artifactType: item.format,
          content: file ? file.name : (itemInputs[item.key] || ''),
          notes: notes || undefined,
          fileName: file?.name,
          fileSize: file?.size,
        });
      });
    } else if (hasFileUpload && fileData) {
      addSubmission({
        id: String(Date.now()),
        hackathonSlug: detail.slug,
        teamName: teamName.trim(),
        submittedAt: new Date().toISOString(),
        artifactType: fileArtifactTypes[0],
        content: fileData.name,
        notes: notes || undefined,
        fileName: fileData.name,
        fileSize: fileData.size,
      });
    } else {
      addSubmission({
        id: String(Date.now()),
        hackathonSlug: detail.slug,
        teamName: teamName.trim(),
        submittedAt: new Date().toISOString(),
        artifactType: submit.allowedArtifactTypes[0] || 'text',
        content: content.trim(),
        notes: notes || undefined,
      });
    }

    setSubmitted(true);
    setTeamName('');
    setContent('');
    setNotes('');
    setItemInputs({});
    setFileData(null);
    setItemFiles({});
    if (fileInputRef.current) fileInputRef.current.value = '';
    setTimeout(() => setSubmitted(false), 3000);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const pastSubmissions = getSubmissionsByHackathon(detail.slug);

  return (
    <div className="space-y-6">
      <SectionTitle>SUBMISSION GUIDE</SectionTitle>

      <div className="space-y-2">
        {submit.guide.map((g, i) => (
          <div key={i} className="flex gap-3 items-start">
            <span className="font-mono text-xs text-[--accent] mt-0.5 shrink-0">{String(i + 1).padStart(2, '0')}</span>
            <p className="text-sm font-sans text-[--text-primary]">{g}</p>
          </div>
        ))}
      </div>

      {submit.submissionItems && (
        <div className="space-y-2">
          <SectionTitle>SUBMISSION ITEMS</SectionTitle>
          {submit.submissionItems.map((item, i) => (
            <div key={item.key} className="bg-[--bg-elevated] border border-[--border] rounded p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-xs text-[--accent]">STEP {i + 1}</span>
                <span className="font-mono text-xs text-[--text-secondary]">({item.format})</span>
              </div>
              <p className="text-sm font-sans text-[--text-primary]">{item.title}</p>
            </div>
          ))}
        </div>
      )}

      <div className="border-t border-[--border] pt-6">
        <SectionTitle>NEW SUBMISSION</SectionTitle>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="font-mono text-xs text-[--text-secondary] block mb-1">TEAM NAME *</label>
            <input
              type="text"
              value={teamName}
              onChange={e => setTeamName(e.target.value)}
              required
              className="w-full bg-[--bg-base] border border-[--border] rounded px-3 py-2 text-sm text-[--text-primary] font-sans focus:border-[--accent] focus:outline-none transition-colors"
              placeholder="팀 이름 입력"
            />
          </div>

          {submit.submissionItems ? (
            submit.submissionItems.map(item => (
              <div key={item.key}>
                <label className="font-mono text-xs text-[--text-secondary] block mb-1">
                  {item.title} ({item.format})
                </label>
                {isFileFormat(item.format) ? (
                  <div>
                    <input
                      ref={el => { itemFileRefs.current[item.key] = el; }}
                      type="file"
                      accept={item.format === 'pdf' || item.format === 'pdf_url' ? '.pdf' : FILE_TYPES[item.format] || '*'}
                      onChange={e => handleFileSelect(e, item.key)}
                      className="hidden"
                      id={`file-${item.key}`}
                    />
                    {itemFiles[item.key] ? (
                      <div className="flex items-center gap-2 bg-[--bg-base] border border-[--border] rounded px-3 py-2">
                        <FileIcon size={14} className="text-[--accent] shrink-0" />
                        <span className="text-sm text-[--text-primary] font-sans truncate flex-1">{itemFiles[item.key].name}</span>
                        <span className="font-mono text-xs text-[--text-secondary] shrink-0">{formatFileSize(itemFiles[item.key].size)}</span>
                        <button type="button" onClick={() => clearFile(item.key)} className="text-[--text-secondary] hover:text-red-400 transition-colors shrink-0">
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <label
                        htmlFor={`file-${item.key}`}
                        className="flex items-center gap-2 bg-[--bg-base] border border-dashed border-[--border] rounded px-3 py-3 cursor-pointer hover:border-[--accent] transition-colors"
                      >
                        <Upload size={14} className="text-[--text-secondary]" />
                        <span className="font-mono text-xs text-[--text-secondary]">파일 선택 (또는 아래 URL 입력)</span>
                      </label>
                    )}
                    <input
                      type={item.format.includes('url') ? 'url' : 'text'}
                      value={itemInputs[item.key] || ''}
                      onChange={e => setItemInputs(prev => ({ ...prev, [item.key]: e.target.value }))}
                      className="w-full bg-[--bg-base] border border-[--border] rounded px-3 py-2 text-sm text-[--text-primary] font-sans focus:border-[--accent] focus:outline-none transition-colors mt-2"
                      placeholder={item.format.includes('url') ? 'https://...' : '또는 URL/내용 입력'}
                    />
                  </div>
                ) : (
                  <input
                    type={item.format.includes('url') ? 'url' : 'text'}
                    value={itemInputs[item.key] || ''}
                    onChange={e => setItemInputs(prev => ({ ...prev, [item.key]: e.target.value }))}
                    className="w-full bg-[--bg-base] border border-[--border] rounded px-3 py-2 text-sm text-[--text-primary] font-sans focus:border-[--accent] focus:outline-none transition-colors"
                    placeholder={item.format.includes('url') ? 'https://...' : '내용 입력'}
                  />
                )}
              </div>
            ))
          ) : hasFileUpload ? (
            <div>
              <label className="font-mono text-xs text-[--text-secondary] block mb-1">
                FILE UPLOAD ({fileArtifactTypes.join(', ').toUpperCase()})
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept={acceptStr}
                onChange={e => handleFileSelect(e)}
                className="hidden"
                id="file-upload-main"
              />
              {fileData ? (
                <div className="flex items-center gap-2 bg-[--bg-base] border border-[--border] rounded px-3 py-2">
                  <FileIcon size={14} className="text-[--accent] shrink-0" />
                  <span className="text-sm text-[--text-primary] font-sans truncate flex-1">{fileData.name}</span>
                  <span className="font-mono text-xs text-[--text-secondary] shrink-0">{formatFileSize(fileData.size)}</span>
                  <button type="button" onClick={() => clearFile()} className="text-[--text-secondary] hover:text-red-400 transition-colors shrink-0">
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <label
                  htmlFor="file-upload-main"
                  className="flex flex-col items-center gap-2 bg-[--bg-base] border border-dashed border-[--border] rounded px-3 py-6 cursor-pointer hover:border-[--accent] transition-colors"
                >
                  <Upload size={20} className="text-[--text-secondary]" />
                  <span className="font-mono text-xs text-[--text-secondary]">클릭하여 파일 선택</span>
                  <span className="font-mono text-xs text-[--text-secondary]">({fileArtifactTypes.join(', ').toUpperCase()} 형식)</span>
                </label>
              )}
            </div>
          ) : (
            <div>
              <label className="font-mono text-xs text-[--text-secondary] block mb-1">
                {submit.allowedArtifactTypes.includes('url') ? 'URL' : 'CONTENT'}
              </label>
              {submit.allowedArtifactTypes.includes('text') ? (
                <textarea
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  rows={3}
                  className="w-full bg-[--bg-base] border border-[--border] rounded px-3 py-2 text-sm text-[--text-primary] font-sans focus:border-[--accent] focus:outline-none transition-colors resize-none"
                  placeholder="내용 입력"
                />
              ) : (
                <input
                  type="text"
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  className="w-full bg-[--bg-base] border border-[--border] rounded px-3 py-2 text-sm text-[--text-primary] font-sans focus:border-[--accent] focus:outline-none transition-colors"
                  placeholder={submit.allowedArtifactTypes.includes('url') ? 'https://...' : '내용 입력'}
                />
              )}
            </div>
          )}

          <div>
            <label className="font-mono text-xs text-[--text-secondary] block mb-1">NOTES (OPTIONAL)</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={2}
              className="w-full bg-[--bg-base] border border-[--border] rounded px-3 py-2 text-sm text-[--text-primary] font-sans focus:border-[--accent] focus:outline-none transition-colors resize-none"
              placeholder="추가 메모"
            />
          </div>

          <button
            type="submit"
            className="bg-[--accent] text-black font-mono font-bold text-sm px-6 py-2 rounded hover:brightness-110 transition-all"
          >
            제출하기
          </button>

          {submitted && (
            <p className="font-mono text-xs text-green-400">✓ SUBMISSION RECORDED SUCCESSFULLY</p>
          )}
        </form>
      </div>

      {/* SUBMISSION HISTORY */}
      {pastSubmissions.length > 0 && (
        <div className="border-t border-[--border] pt-6">
          <SectionTitle>SUBMISSION HISTORY</SectionTitle>
          <div className="space-y-2 mt-4">
            {pastSubmissions.map((sub, i) => (
              <div key={sub.id} className="font-mono text-sm leading-tight group py-2 border-b border-[--border]/40 last:border-0">
                <div className="flex items-center gap-3 text-[--text-secondary]">
                  <span className="text-[--accent] font-bold">#{i + 1}</span>
                  <span className="w-8 opacity-70">{sub.artifactType}</span>
                  <span>{new Date(sub.submittedAt).toLocaleString('sv-SE', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).replace('T', ' ')}</span>
                </div>
                <div className="pl-14 pt-1 text-[--text-primary] opacity-80 group-hover:opacity-100 transition-opacity">
                  {sub.fileName ? (
                    <span className="truncate block">{sub.fileName} {sub.fileSize !== undefined && `— ${formatFileSize(sub.fileSize)}`}</span>
                  ) : (
                    <span className="truncate block">{sub.content}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
