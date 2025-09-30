import { ArrowButton } from 'src/ui/arrow-button';
import { Button } from 'src/ui/button';
import { Text } from 'src/ui/text';
import { Select } from 'src/ui/select';
import styles from './ArticleParamsForm.module.scss';
import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import {
	ArticleStateType,
	backgroundColors,
	contentWidthArr,
	defaultArticleState,
	fontColors,
	fontFamilyOptions,
	fontSizeOptions,
	OptionType,
} from 'src/constants/articleProps';
import { RadioGroup } from 'src/ui/radio-group';
import { Separator } from 'src/ui/separator';
import { useOutsideClickClose } from 'src/ui/select/hooks/useOutsideClickClose';

type ArticleParamsFormProps = {
	newArticleState: ArticleStateType;
	onChangeArticle: (state: ArticleStateType) => void;
};

export const ArticleParamsForm = ({
	newArticleState,
	onChangeArticle,
}: ArticleParamsFormProps) => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const sidebarRef = useRef<HTMLDivElement>(null);
	const [tempArticleState, setTempArticleState] =
		useState<ArticleStateType>(newArticleState);

	useEffect(() => {
		const handleEscape = (event: KeyboardEvent) => {
			event.key === 'Escape' && setIsModalOpen(false);
		};
		document.addEventListener('keydown', handleEscape);

		return () => {
			document.removeEventListener('keydown', handleEscape);
		};
	}, [isModalOpen]);

	useOutsideClickClose({
		isOpen: isModalOpen,
		rootRef: sidebarRef,
		onChange: setIsModalOpen,
	});

	function handleSelectChange(field: keyof ArticleStateType) {
		return function (selected: OptionType) {
			setTempArticleState((prev) => ({
				...prev,
				[field]: selected,
			}));
		};
	}

	function handleResetForm(event: React.FormEvent) {
		event.preventDefault();
		setTempArticleState(defaultArticleState);
		onChangeArticle(defaultArticleState);
	}

	function handleSubmitForm(event: React.FormEvent) {
		event.preventDefault();
		onChangeArticle(tempArticleState);
		setIsModalOpen(false);
	}

	return (
		<>
			<ArrowButton
				isOpen={isModalOpen}
				onClick={() => {
					setIsModalOpen(!isModalOpen);
				}}
			/>
			<aside
				ref={sidebarRef}
				onClick={(e) => e.stopPropagation()}
				className={clsx(styles.container, {
					[styles.container_open]: isModalOpen,
				})}>
				<form
					className={styles.form}
					onSubmit={handleSubmitForm}
					onReset={handleResetForm}>
					<Text as='h2' size={31} weight={800} uppercase>
						Задайте параметры
					</Text>
					<Select
						title={'Шрифт'}
						selected={tempArticleState.fontFamilyOption}
						onChange={handleSelectChange('fontFamilyOption')}
						options={fontFamilyOptions}></Select>
					<RadioGroup
						name={'fontSize'}
						options={fontSizeOptions}
						selected={tempArticleState.fontSizeOption}
						onChange={handleSelectChange('fontSizeOption')}
						title={'Размер шрифта'}></RadioGroup>
					<Select
						title={'Цвет шрифта'}
						options={fontColors}
						selected={tempArticleState.fontColor}
						onChange={handleSelectChange('fontColor')}></Select>
					<Separator></Separator>
					<Select
						title={'Цвет фона'}
						selected={tempArticleState.backgroundColor}
						options={backgroundColors}
						onChange={handleSelectChange('backgroundColor')}></Select>
					<Select
						title={'Ширина контента'}
						selected={tempArticleState.contentWidth}
						options={contentWidthArr}
						onChange={handleSelectChange('contentWidth')}></Select>
					<div className={styles.bottomContainer}>
						<Button title='Сбросить' htmlType='reset' type='clear' />
						<Button title='Применить' htmlType='submit' type='apply' />
					</div>
				</form>
			</aside>
		</>
	);
};
