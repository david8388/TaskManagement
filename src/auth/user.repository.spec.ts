import { Test } from '@nestjs/testing';
import { UserRepository } from './user.repository';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

const mockCredentialsDto = {
  username: 'Testusername',
  password: 'Testpassword',
};

describe('UserRepository', () => {
  let userRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [UserRepository],
    }).compile();

    userRepository = await module.get<UserRepository>(UserRepository);
  });

  describe('signUp', () => {
    let save;
    beforeEach(() => {
      (save = jest.fn()),
        (userRepository.create = jest.fn().mockResolvedValue({ save }));
    });

    it('successfully signs up the user', () => {
      save.mockResolvedValue(undefined);
      expect(userRepository.signUp(mockCredentialsDto)).resolves.not.toThrow();
    });

    it('throws a conflict exception as username already exists', () => {
      save.mockRejectedValue({ code: '23505' });
      expect(userRepository.signUp(mockCredentialsDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('throws a internal exception', () => {
      save.mockRejectedValue({ code: '123123' }); // unhandled error
      expect(userRepository.signUp(mockCredentialsDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    describe('validateUserpassword', () => {
      let user;

      beforeEach(() => {
        userRepository.findOne = jest.fn();
        user = new User();
        user.username = 'Testusername';
        user.validatePassword = jest.fn();
      });

      it('returns the username as validation is successful', async () => {
        userRepository.findOne.mockResolvedValue(user);
        user.validatePassword.mockResolvedValue(true);
        const result = await userRepository.validateUserPassword(
          mockCredentialsDto,
        );
        expect(result).toEqual('Testusername');
      });

      it('returns null as user cannot be found', async () => {
        userRepository.findOne.mockResolvedValue(null);
        const result = await userRepository.validateUserPassword(
          mockCredentialsDto,
        );
        expect(user.validatePassword).not.toHaveBeenCalled();
        expect(result).toBeNull();
      });

      it('returns null as password is invalid', async () => {
        userRepository.findOne.mockResolvedValue(user);
        user.validatePassword.mockResolvedValue(false);
        const result = await userRepository.validateUserPassword(
          mockCredentialsDto,
        );
        expect(user.validatePassword).toHaveBeenCalled();
        expect(result).toBeNull();
      });

      describe('hash password', () => {
        it('calls bcrypt.hash to generate a hash', async () => {
          bcrypt.hash = jest.fn().mockResolvedValue('testHash');
          expect(bcrypt.hash).not.toHaveBeenCalled();
          const result = await userRepository.hashPassword(
            'testPassword',
            'testSalt',
          );
          expect(bcrypt.hash).toHaveBeenCalledWith('testPassword', 'testSalt');
          expect(result).toEqual('testHash');
        });
      });
    });
  });
});
